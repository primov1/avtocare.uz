import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn,} from 'typeorm';
import {AppointmentEntity} from './appointment.entity';
import {ServiceHistoryEntity} from './service-history.entity';

export enum WorkshopStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
}

@Entity('workshops')
export class WorkshopEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    address: string;

    @Column()
    phone: string;

    @Column({nullable: true})
    description: string;

    @Column({
        type: 'enum',
        enum: WorkshopStatus,
        default: WorkshopStatus.PENDING,
    })
    status: WorkshopStatus;

    // Workshop -> Appointments (bu ustaxonadagi barcha navbatlar)
    @OneToMany(() => AppointmentEntity, (appointment) => appointment.workshop)
    appointments: AppointmentEntity[];

    // Workshop -> ServiceHistories (bu ustaxonada bajarilgan barcha ishlar)
    @OneToMany(() => ServiceHistoryEntity, (history) => history.workshop)
    serviceHistories: ServiceHistoryEntity[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
