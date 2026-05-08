import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn,} from 'typeorm';
import {VehicleEntity} from './vehicle.entity';
import {AppointmentEntity} from './appointment.entity';
import {ShopItemEntity} from './shop-item.entity';

export enum UserRole {
    SUPER_ADMIN = 'SUPER_ADMIN',
    WORKSHOP_ADMIN = 'WORKSHOP_ADMIN',
    MASTER = 'MASTER',
    DRIVER = 'DRIVER',
    STORE_OWNER = 'STORE_OWNER',
}

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, nullable: true }) // nullable qo'shildi
    email: string;

    @Column()
    password: string;

    @Column({type: 'enum', enum: UserRole, default: UserRole.DRIVER})
    role: UserRole;

    @Column({nullable: true})
    fullName: string;

    @Column({nullable: true})
    phone: string;

    // Driver -> Vehicles (bir haydovchining ko'p mashinalari bo'lishi mumkin)
    @OneToMany(() => VehicleEntity, (vehicle) => vehicle.owner, {cascade: true})
    vehicles: VehicleEntity[];

    // User -> Appointments (mijoz sifatida)
    @OneToMany(() => AppointmentEntity, (appointment) => appointment.driver)
    appointments: AppointmentEntity[];

    // Master -> Appointments (usta sifatida)
    @OneToMany(() => AppointmentEntity, (appointment) => appointment.master)
    assignedAppointments: AppointmentEntity[];

    // Store Owner -> Inventory
    @OneToMany(() => ShopItemEntity, (item) => item.owner)
    inventoryItems: ShopItemEntity[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
