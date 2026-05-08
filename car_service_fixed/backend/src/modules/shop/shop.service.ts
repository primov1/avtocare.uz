import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthenticatedUser } from '../auth/interfaces/jwt-payload.interface';
import { ShopItemEntity } from '../../entities/shop-item.entity';
import { CreateInventoryItemDto, UpdateInventoryItemDto } from './dto/shop.dto';

@Injectable()
export class ShopService {
    constructor(
        @InjectRepository(ShopItemEntity)
        private readonly itemRepo: Repository<ShopItemEntity>,
    ) {}

    async createItem(dto: CreateInventoryItemDto, user: AuthenticatedUser): Promise<ShopItemEntity> {
        const item = this.itemRepo.create({
            ...dto,
            ownerId: user.userId,
        });
        return this.itemRepo.save(item);
    }

    async getInventory(user: AuthenticatedUser): Promise<ShopItemEntity[]> {
        return this.itemRepo.find({
            where: { ownerId: user.userId },
            order: { createdAt: 'DESC' },
        });
    }

    async updateItem(
        itemId: string,
        dto: UpdateInventoryItemDto,
        user: AuthenticatedUser,
    ): Promise<ShopItemEntity> {
        const item = await this.itemRepo.findOne({ where: { id: itemId } });
        if (!item) {
            throw new NotFoundException('Inventar elementi topilmadi');
        }
        if (item.ownerId !== user.userId) {
            throw new ForbiddenException('Siz faqat o\'z inventaringizni yangilashingiz mumkin');
        }

        Object.assign(item, dto);
        return this.itemRepo.save(item);
    }

    async getCatalog(): Promise<ShopItemEntity[]> {
        return this.itemRepo.find({
            where: { isPublic: true },
            order: { createdAt: 'DESC' },
        });
    }
}
