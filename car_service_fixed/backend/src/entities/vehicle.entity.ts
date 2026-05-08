import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import {UserEntity} from './user.entity';
import {AppointmentEntity} from './appointment.entity';
import {ServiceHistoryEntity} from './service-history.entity';

@Entity('vehicles')
export class VehicleEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    make: string; // Masalan: Toyota, Chevrolet

    @Column()
    model: string; // Masalan: Cobalt, Malibu

    @Column({unique: true})
    plateNumber: string; // Davlat raqami

    @Column({unique: true, nullable: true})
    vin: string; // Vehicle Identification Number

    @Column({nullable: true})
    year: number;

    @Column({nullable: true})
    color: string;

    @Column({nullable: true})
    currentMileage: number;

    // Vehicle -> Owner (ManyToOne: ko'p mashina bitta haydovchiga tegishli)
    @ManyToOne(() => UserEntity, (user) => user.vehicles, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'ownerId'})
    owner: UserEntity;

    @Column()
    ownerId: string;

    // Vehicle -> Appointments
    @OneToMany(() => AppointmentEntity, (appointment) => appointment.vehicle)
    appointments: AppointmentEntity[];

    // Vehicle -> ServiceHistories (mashinaning to'liq servis tarixi)
    @OneToMany(() => ServiceHistoryEntity, (history) => history.vehicle, {
        cascade: true,
    })
    serviceHistories: ServiceHistoryEntity[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
