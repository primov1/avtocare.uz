import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity, UserRole } from '../../entities/user.entity';
import { WorkshopEntity, WorkshopStatus } from '../../entities/workshop.entity';
import { AuthenticatedUser } from '../auth/interfaces/jwt-payload.interface';
import { UpdateWorkshopStatusDto } from './dto/super-admin.dto';

@Injectable()
export class SuperAdminService {
    constructor(
        @InjectRepository(WorkshopEntity)
        private readonly workshopRepo: Repository<WorkshopEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
    ) {}

    async getWorkshops(): Promise<WorkshopEntity[]> {
        return this.workshopRepo.find({ order: { createdAt: 'DESC' } });
    }

    async updateWorkshopStatus(
        workshopId: string,
        dto: UpdateWorkshopStatusDto,
        user: AuthenticatedUser,
    ): Promise<WorkshopEntity> {
        if (user.role !== UserRole.SUPER_ADMIN) {
            throw new BadRequestException('Faqat Super Admin bu amalni bajarishi mumkin');
        }

        const workshop = await this.workshopRepo.findOne({ where: { id: workshopId } });
        if (!workshop) {
            throw new NotFoundException('Ustaxona topilmadi');
        }

        workshop.status = dto.status;
        return this.workshopRepo.save(workshop);
    }

    async getUsers(): Promise<Partial<UserEntity>[]> {
        return this.userRepo.find({
            select: ['id', 'email', 'fullName', 'phone', 'role', 'createdAt'],
            order: { createdAt: 'DESC' },
        });
    }
}
