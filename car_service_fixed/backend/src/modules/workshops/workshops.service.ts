import {BadRequestException, ForbiddenException, Injectable, NotFoundException,} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {AppointmentEntity, AppointmentStatus} from '../../entities/appointment.entity';
import {ServiceHistoryEntity} from '../../entities/service-history.entity';
import {UserEntity, UserRole} from '../../entities/user.entity';
import {VehicleEntity} from '../../entities/vehicle.entity';
import {WorkshopEntity} from '../../entities/workshop.entity';
import {AuthenticatedUser} from '../auth/interfaces/jwt-payload.interface';
import {CreateServiceHistoryDto, FilterAppointmentsDto, UpdateAppointmentStatusDto,} from './dto/workshop.dto';

@Injectable()
export class WorkshopsService {
    constructor(
        @InjectRepository(WorkshopEntity)
        private readonly workshopRepo: Repository<WorkshopEntity>,
        @InjectRepository(AppointmentEntity)
        private readonly appointmentRepo: Repository<AppointmentEntity>,
        @InjectRepository(ServiceHistoryEntity)
        private readonly serviceHistoryRepo: Repository<ServiceHistoryEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
        @InjectRepository(VehicleEntity)
        private readonly vehicleRepo: Repository<VehicleEntity>,
    ) {
    }

    // ─── GET WORKSHOP INFO ──────────────────────────────────────────────────────
    async getMyWorkshop(workshopId: string): Promise<WorkshopEntity> {
        const workshop = await this.workshopRepo.findOne({
            where: {id: workshopId},
        });
        if (!workshop) {
            throw new NotFoundException('Ustaxona topilmadi');
        }
        return workshop;
    }

    // ─── GET APPOINTMENTS ───────────────────────────────────────────────────────
    async getAppointments(
        workshopId: string,
        filters: FilterAppointmentsDto,
        currentUser: AuthenticatedUser,
    ): Promise<AppointmentEntity[]> {
        const qb = this.appointmentRepo
            .createQueryBuilder('appointment')
            .leftJoinAndSelect('appointment.driver', 'driver')
            .leftJoinAndSelect('appointment.vehicle', 'vehicle')
            .leftJoinAndSelect('appointment.master', 'master')
            .where('appointment.workshopId = :workshopId', {workshopId});

        // MASTER faqat o'ziga biriktirilgan navbatlarni ko'radi
        if (currentUser.role === UserRole.MASTER) {
            qb.andWhere('appointment.masterId = :masterId', {
                masterId: currentUser.userId,
            });
        }

        // Status filtri
        if (filters.status) {
            qb.andWhere('appointment.status = :status', {status: filters.status});
        }

        // Usta filtri (faqat WORKSHOP_ADMIN uchun)
        if (filters.masterId && currentUser.role === UserRole.WORKSHOP_ADMIN) {
            qb.andWhere('appointment.masterId = :masterId', {
                masterId: filters.masterId,
            });
        }

        // Sana filtri
        if (filters.date) {
            qb.andWhere('DATE(appointment.date) = :date', {date: filters.date});
        }

        qb.orderBy('appointment.date', 'ASC');

        return qb.getMany();
    }

    // ─── UPDATE APPOINTMENT STATUS ──────────────────────────────────────────────
    async updateAppointmentStatus(
        appointmentId: string,
        dto: UpdateAppointmentStatusDto,
        workshopId: string,
        currentUser: AuthenticatedUser,
    ): Promise<AppointmentEntity> {
        const appointment = await this.appointmentRepo.findOne({
            where: {id: appointmentId},
            relations: ['master', 'driver', 'vehicle'],
        });

        if (!appointment) {
            throw new NotFoundException('Navbat topilmadi');
        }

        // Multi-tenancy tekshiruvi: navbat bu ustaxonanikimi?
        if (appointment.workshopId !== workshopId) {
            throw new ForbiddenException(
                'Siz faqat o\'z ustaxonangiz navbatlarini o\'zgartira olasiz',
            );
        }

        // MASTER faqat o'ziga biriktirilgan navbatni o'zgartira oladi
        if (
            currentUser.role === UserRole.MASTER &&
            appointment.masterId !== currentUser.userId
        ) {
            throw new ForbiddenException(
                'Siz faqat o\'zingizga biriktirilgan navbatlarni o\'zgartira olasiz',
            );
        }

        // Status o'tish mantig'ini tekshirish
        this.validateStatusTransition(appointment.status, dto.status);

        // Ustani biriktirish (WORKSHOP_ADMIN tomonidan)
        if (dto.masterId && currentUser.role === UserRole.WORKSHOP_ADMIN) {
            const master = await this.userRepo.findOne({
                where: {id: dto.masterId, role: UserRole.MASTER},
            });
            if (!master) {
                throw new NotFoundException('Usta topilmadi');
            }
            appointment.masterId = dto.masterId;
        }

        appointment.status = dto.status;
        return this.appointmentRepo.save(appointment);
    }

    // ─── CREATE SERVICE HISTORY ─────────────────────────────────────────────────
    async createServiceHistory(
        dto: CreateServiceHistoryDto,
        workshopId: string,
        currentUser: AuthenticatedUser,
    ): Promise<ServiceHistoryEntity> {
        // Mashina mavjudmi?
        const vehicle = await this.vehicleRepo.findOne({
            where: {id: dto.vehicleId},
        });
        if (!vehicle) {
            throw new NotFoundException('Mashina topilmadi');
        }

        // Navbat tekshiruvi (agar berilgan bo'lsa)
        if (dto.appointmentId) {
            const appointment = await this.appointmentRepo.findOne({
                where: {id: dto.appointmentId},
            });

            if (!appointment) {
                throw new NotFoundException('Navbat topilmadi');
            }

            // Navbat bu ustaxonanikimi?
            if (appointment.workshopId !== workshopId) {
                throw new ForbiddenException('Bu navbat sizning ustaxonangizga tegishli emas');
            }

            // Navbat tugallanishi kerak yoki jarayonda bo'lishi kerak
            if (
                appointment.status !== AppointmentStatus.COMPLETED &&
                appointment.status !== AppointmentStatus.IN_PROGRESS
            ) {
                throw new BadRequestException(
                    'Servis tarixi faqat IN_PROGRESS yoki COMPLETED navbatlar uchun qo\'shilishi mumkin',
                );
            }
        }

        // Servis tarixini yaratish
        const serviceHistory = this.serviceHistoryRepo.create({
            vehicleId: dto.vehicleId,
            workshopId,
            appointmentId: dto.appointmentId,
            description: dto.description,
            cost: dto.cost,
            mileage: dto.mileage,
            partsUsed: dto.partsUsed,
            nextServiceMileage: dto.nextServiceMileage,
            nextServiceDate: dto.nextServiceDate
                ? new Date(dto.nextServiceDate)
                : undefined,
        });

        const saved = await this.serviceHistoryRepo.save(serviceHistory);

        // Mashinaning joriy probegini yangilash
        if (dto.mileage && dto.mileage > (vehicle.currentMileage || 0)) {
            await this.vehicleRepo.update(vehicle.id, {
                currentMileage: dto.mileage,
            });
        }

        // Navbatni avtomatik COMPLETED ga o'tkazish (agar appointmentId berilgan bo'lsa)
        if (dto.appointmentId) {
            await this.appointmentRepo.update(dto.appointmentId, {
                status: AppointmentStatus.COMPLETED,
            });
        }

        return saved;
    }

    // ─── GET MASTERS ────────────────────────────────────────────────────────────
    async getMasters(workshopId: string): Promise<Partial<UserEntity>[]> {
        // Hozircha: Rol bo'yicha MASTER larni olish
        // Keyinchalik WorkshopMember entity orqali to'g'rilash mumkin
        const masters = await this.userRepo.find({
            where: {role: UserRole.MASTER},
            select: ['id', 'fullName', 'email', 'phone', 'createdAt'],
        });
        return masters;
    }

    // ─── GET SERVICE HISTORY FOR VEHICLE ───────────────────────────────────────
    async getVehicleHistory(
        vehicleId: string,
        workshopId: string,
    ): Promise<ServiceHistoryEntity[]> {
        return this.serviceHistoryRepo.find({
            where: {vehicleId, workshopId},
            relations: ['vehicle', 'appointment'],
            order: {createdAt: 'DESC'},
        });
    }

    // ─── STATS (Dashboard uchun) ────────────────────────────────────────────────
    async getWorkshopStats(workshopId: string) {
        const [total, pending, inProgress, completed] = await Promise.all([
            this.appointmentRepo.count({where: {workshopId}}),
            this.appointmentRepo.count({
                where: {workshopId, status: AppointmentStatus.PENDING},
            }),
            this.appointmentRepo.count({
                where: {workshopId, status: AppointmentStatus.IN_PROGRESS},
            }),
            this.appointmentRepo.count({
                where: {workshopId, status: AppointmentStatus.COMPLETED},
            }),
        ]);

        // Oylik daromad
        const revenueResult = await this.serviceHistoryRepo
            .createQueryBuilder('sh')
            .select('SUM(sh.cost)', 'total')
            .where('sh.workshopId = :workshopId', {workshopId})
            .andWhere('sh.createdAt >= :startOfMonth', {
                startOfMonth: new Date(new Date().setDate(1)),
            })
            .getRawOne();

        return {
            appointments: {total, pending, inProgress, completed},
            monthlyRevenue: parseFloat(revenueResult?.total || '0'),
        };
    }

    // ─── PRIVATE: Status o'tish validatsiyasi ───────────────────────────────────
    private validateStatusTransition(
        current: AppointmentStatus,
        next: AppointmentStatus,
    ): void {
        const allowedTransitions: Record<AppointmentStatus, AppointmentStatus[]> = {
            [AppointmentStatus.PENDING]: [
                AppointmentStatus.CONFIRMED,
                AppointmentStatus.CANCELLED,
            ],
            [AppointmentStatus.CONFIRMED]: [
                AppointmentStatus.IN_PROGRESS,
                AppointmentStatus.CANCELLED,
            ],
            [AppointmentStatus.IN_PROGRESS]: [AppointmentStatus.COMPLETED],
            [AppointmentStatus.COMPLETED]: [],
            [AppointmentStatus.CANCELLED]: [],
        };

        if (!allowedTransitions[current].includes(next)) {
            throw new BadRequestException(
                `Status '${current}' dan '${next}' ga o'tish mumkin emas. ` +
                `Ruxsat etilgan: [${allowedTransitions[current].join(', ')}]`,
            );
        }
    }
}
