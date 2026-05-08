import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {AppointmentEntity, AppointmentStatus} from '../../entities/appointment.entity';
import {ServiceHistoryEntity} from '../../entities/service-history.entity';
import {VehicleEntity} from '../../entities/vehicle.entity';
import {WorkshopEntity, WorkshopStatus} from '../../entities/workshop.entity';
import {AuthenticatedUser} from '../auth/interfaces/jwt-payload.interface';
import {AddVehicleDto, CreateAppointmentDto, FilterDriverAppointmentsDto, FilterWorkshopsDto,} from './dto/driver.dto';

@Injectable()
export class DriverService {
    constructor(
        @InjectRepository(VehicleEntity)
        private readonly vehicleRepo: Repository<VehicleEntity>,
        @InjectRepository(AppointmentEntity)
        private readonly appointmentRepo: Repository<AppointmentEntity>,
        @InjectRepository(ServiceHistoryEntity)
        private readonly serviceHistoryRepo: Repository<ServiceHistoryEntity>,
        @InjectRepository(WorkshopEntity)
        private readonly workshopRepo: Repository<WorkshopEntity>,
    ) {
    }

    // ════════════════════════════════════════════════════════════════
    //  VIRTUAL GARAGE
    // ════════════════════════════════════════════════════════════════

    async addVehicle(
        dto: AddVehicleDto,
        user: AuthenticatedUser,
    ): Promise<VehicleEntity> {
        // Davlat raqami takrorlanmasin
        const existingPlate = await this.vehicleRepo.findOne({
            where: {plateNumber: dto.plateNumber},
        });
        if (existingPlate) {
            throw new ConflictException(
                `'${dto.plateNumber}' raqamli mashina allaqachon ro'yxatdan o'tgan`,
            );
        }

        // VIN takrorlanmasin
        if (dto.vin) {
            const existingVin = await this.vehicleRepo.findOne({
                where: {vin: dto.vin},
            });
            if (existingVin) {
                throw new ConflictException(`Bu VIN raqam allaqachon tizimda mavjud`);
            }
        }

        const vehicle = this.vehicleRepo.create({
            ...dto,
            ownerId: user.userId,
        });

        return this.vehicleRepo.save(vehicle);
    }

    async getMyVehicles(user: AuthenticatedUser): Promise<VehicleEntity[]> {
        return this.vehicleRepo.find({
            where: {ownerId: user.userId}, // Faqat o'z mashinalari
            order: {createdAt: 'DESC'},
        });
    }

    async getVehicleById(
        vehicleId: string,
        user: AuthenticatedUser,
    ): Promise<VehicleEntity> {
        const vehicle = await this.vehicleRepo.findOne({
            where: {id: vehicleId},
        });

        if (!vehicle) {
            throw new NotFoundException('Mashina topilmadi');
        }

        // Faqat egasi ko'ra oladi
        this.assertOwnership(vehicle.ownerId, user.userId, 'Mashina');

        return vehicle;
    }

    async getVehicleHistory(
        vehicleId: string,
        user: AuthenticatedUser,
    ): Promise<ServiceHistoryEntity[]> {
        // Avval mashina egasini tekshiramiz
        await this.getVehicleById(vehicleId, user);

        return this.serviceHistoryRepo.find({
            where: {vehicleId},
            relations: ['workshop', 'appointment'],
            order: {createdAt: 'DESC'},
        });
    }

    // ════════════════════════════════════════════════════════════════
    //  WORKSHOPS LIST
    // ════════════════════════════════════════════════════════════════

    async getWorkshops(filters: FilterWorkshopsDto): Promise<WorkshopEntity[]> {
        const qb = this.workshopRepo
            .createQueryBuilder('workshop')
            .where('workshop.status = :status', {
                status: WorkshopStatus.APPROVED,
            });

        // Shahar yoki manzil bo'yicha qidirish
        if (filters.city) {
            qb.andWhere('workshop.address ILIKE :city', {
                city: `%${filters.city}%`,
            });
        }

        // Ism bo'yicha qidirish
        if (filters.search) {
            qb.andWhere(
                '(workshop.name ILIKE :search OR workshop.address ILIKE :search)',
                {search: `%${filters.search}%`},
            );
        }

        return qb.orderBy('workshop.name', 'ASC').getMany();
    }

    async getWorkshopById(workshopId: string): Promise<WorkshopEntity> {
        const workshop = await this.workshopRepo.findOne({
            where: {id: workshopId, status: WorkshopStatus.APPROVED},
        });

        if (!workshop) {
            throw new NotFoundException('Ustaxona topilmadi yoki hali tasdiqlanmagan');
        }

        return workshop;
    }

    // ════════════════════════════════════════════════════════════════
    //  BOOKING SYSTEM
    // ════════════════════════════════════════════════════════════════

    async createAppointment(
        dto: CreateAppointmentDto,
        user: AuthenticatedUser,
    ): Promise<AppointmentEntity> {
        // 1. Mashina haydovchiga tegishlimi?
        const vehicle = await this.vehicleRepo.findOne({
            where: {id: dto.vehicleId},
        });
        if (!vehicle) {
            throw new NotFoundException('Mashina topilmadi');
        }
        this.assertOwnership(vehicle.ownerId, user.userId, 'Mashina');

        // 2. Ustaxona mavjud va tasdiqlanganmi?
        await this.getWorkshopById(dto.workshopId);

        // 3. Sana o'tmishdami?
        const appointmentDate = new Date(dto.date);
        if (appointmentDate <= new Date()) {
            throw new BadRequestException(
                'Navbat sanasi kelajakda bo\'lishi kerak',
            );
        }

        // 4. Bir xil vaqtda boshqa navbat bormi?
        const conflict = await this.appointmentRepo
            .createQueryBuilder('apt')
            .where('apt.driverId = :driverId', {driverId: user.userId})
            .andWhere('apt.status NOT IN (:...statuses)', {
                statuses: [AppointmentStatus.CANCELLED, AppointmentStatus.COMPLETED],
            })
            .andWhere(
                `apt.date BETWEEN :start AND :end`,
                {
                    start: new Date(appointmentDate.getTime() - 60 * 60 * 1000),
                    end: new Date(appointmentDate.getTime() + 60 * 60 * 1000),
                },
            )
            .getOne();

        if (conflict) {
            throw new ConflictException(
                'Bu vaqt atrofida sizda allaqachon navbat mavjud (±1 soat)',
            );
        }

        const appointment = this.appointmentRepo.create({
            driverId: user.userId,
            vehicleId: dto.vehicleId,
            workshopId: dto.workshopId,
            date: appointmentDate,
            notes: dto.notes,
            problemDescription: dto.problemDescription,
            status: AppointmentStatus.PENDING,
        });

        return this.appointmentRepo.save(appointment);
    }

    async getMyAppointments(
        user: AuthenticatedUser,
        filters: FilterDriverAppointmentsDto,
    ): Promise<AppointmentEntity[]> {
        const qb = this.appointmentRepo
            .createQueryBuilder('appointment')
            .leftJoinAndSelect('appointment.vehicle', 'vehicle')
            .leftJoinAndSelect('appointment.workshop', 'workshop')
            .leftJoinAndSelect('appointment.master', 'master')
            .where('appointment.driverId = :driverId', {driverId: user.userId});

        if (filters.status) {
            qb.andWhere('appointment.status = :status', {status: filters.status});
        }

        if (filters.vehicleId) {
            qb.andWhere('appointment.vehicleId = :vehicleId', {
                vehicleId: filters.vehicleId,
            });
        }

        return qb.orderBy('appointment.date', 'DESC').getMany();
    }

    async getAppointmentById(
        appointmentId: string,
        user: AuthenticatedUser,
    ): Promise<AppointmentEntity> {
        const appointment = await this.appointmentRepo.findOne({
            where: {id: appointmentId},
            relations: ['vehicle', 'workshop', 'master', 'serviceHistory'],
        });

        if (!appointment) {
            throw new NotFoundException('Navbat topilmadi');
        }

        // Faqat o'z navbatini ko'ra oladi
        this.assertOwnership(appointment.driverId, user.userId, 'Navbat');

        return appointment;
    }

    async cancelAppointment(
        appointmentId: string,
        user: AuthenticatedUser,
    ): Promise<AppointmentEntity> {
        const appointment = await this.getAppointmentById(appointmentId, user);

        const cancellable: AppointmentStatus[] = [
            AppointmentStatus.PENDING,
            AppointmentStatus.CONFIRMED,
        ];

        if (!cancellable.includes(appointment.status)) {
            throw new BadRequestException(
                `'${appointment.status}' statusdagi navbatni bekor qilib bo'lmaydi`,
            );
        }

        appointment.status = AppointmentStatus.CANCELLED;
        return this.appointmentRepo.save(appointment);
    }

    // ════════════════════════════════════════════════════════════════
    //  PRIVATE HELPERS
    // ════════════════════════════════════════════════════════════════

    private assertOwnership(
        ownerId: string,
        currentUserId: string,
        resourceName: string,
    ): void {
        if (ownerId !== currentUserId) {
            throw new ForbiddenException(
                `${resourceName} sizga tegishli emas`,
            );
        }
    }
}
