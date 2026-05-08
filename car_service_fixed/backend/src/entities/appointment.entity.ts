import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { VehicleEntity } from './vehicle.entity';
import { WorkshopEntity } from './workshop.entity';
import { ServiceHistoryEntity } from './service-history.entity';

export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('appointments')
export class AppointmentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.PENDING,
  })
  status: AppointmentStatus;

  @Column({ nullable: true, type: 'text' })
  notes: string; // Mijozning izohi

  @Column({ nullable: true, type: 'text' })
  problemDescription: string; // Muammo tavsifi

  // --- RELATIONS ---

  // Appointment -> Driver (navbatni kim olgan)
  @ManyToOne(() => UserEntity, (user) => user.appointments, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'driverId' })
  driver: UserEntity;

  @Column({ nullable: true })
  driverId: string;

  // Appointment -> Vehicle (qaysi mashina uchun)
  @ManyToOne(() => VehicleEntity, (vehicle) => vehicle.appointments, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'vehicleId' })
  vehicle: VehicleEntity;

  @Column({ nullable: true })
  vehicleId: string;

  // Appointment -> Workshop (qaysi ustaxonada)
  @ManyToOne(() => WorkshopEntity, (workshop) => workshop.appointments, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'workshopId' })
  workshop: WorkshopEntity;

  @Column({ nullable: true })
  workshopId: string;

  // Appointment -> Master (qaysi usta bajaradi)
  @ManyToOne(() => UserEntity, (user) => user.assignedAppointments, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'masterId' })
  master: UserEntity;

  @Column({ nullable: true })
  masterId: string;

  // Appointment -> ServiceHistory (tugagach servis tarixi yaratiladi)
  @OneToOne(() => ServiceHistoryEntity, (history) => history.appointment, {
    nullable: true,
    cascade: true,
  })
  serviceHistory: ServiceHistoryEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
