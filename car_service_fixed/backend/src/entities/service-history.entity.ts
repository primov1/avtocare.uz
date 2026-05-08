import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import {VehicleEntity} from './vehicle.entity';
import {WorkshopEntity} from './workshop.entity';
import {AppointmentEntity} from './appointment.entity';

@Entity('service_histories')
export class ServiceHistoryEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'text'})
    description: string; // Bajarilgan ishlar tavsifi

    @Column({type: 'decimal', precision: 10, scale: 2})
    cost: number; // Xizmat narxi (so'm)

    @Column({nullable: true})
    mileage: number; // Servis vaqtidagi probeg (km)

    @Column({nullable: true, type: 'text'})
    partsUsed: string; // Ishlatilgan ehtiyot qismlar (JSON string yoki text)

    @Column({nullable: true})
    nextServiceMileage: number; // Keyingi servis uchun probeg

    @Column({nullable: true, type: 'timestamp'})
    nextServiceDate: Date; // Keyingi servis sanasi

    // --- RELATIONS ---

    // ServiceHistory -> Vehicle (qaysi mashina uchun)
    @ManyToOne(() => VehicleEntity, (vehicle) => vehicle.serviceHistories, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({name: 'vehicleId'})
    vehicle: VehicleEntity;

    @Column()
    vehicleId: string;

    // ServiceHistory -> Workshop (qaysi ustaxonada bajarilgan)
    @ManyToOne(() => WorkshopEntity, (workshop) => workshop.serviceHistories, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn({name: 'workshopId'})
    workshop: WorkshopEntity;

    @Column({nullable: true})
    workshopId: string;

    // ServiceHistory -> Appointment (qaysi navbatdan kelib chiqqan)
    @OneToOne(() => AppointmentEntity, (appointment) => appointment.serviceHistory, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn({name: 'appointmentId'})
    appointment: AppointmentEntity;

    @Column({nullable: true})
    appointmentId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
