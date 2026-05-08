import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('shop_items')
export class ShopItemEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    price: number;

    @Column({ default: 0 })
    stock: number;

    @Column({ nullable: true })
    category: string;

    @Column({ default: false })
    isPublic: boolean;

    @ManyToOne(() => UserEntity, (user) => user.inventoryItems, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'ownerId' })
    owner: UserEntity;

    @Column()
    ownerId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
