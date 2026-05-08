import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/user.entity';
import { WorkshopEntity } from '../../entities/workshop.entity';
import { AuthModule } from '../auth/auth.module';
import { SuperAdminController } from './super-admin.controller';
import { SuperAdminService } from './super-admin.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, WorkshopEntity]),
        AuthModule,
    ],
    controllers: [SuperAdminController],
    providers: [SuperAdminService],
    exports: [SuperAdminService],
})
export class SuperAdminModule {}
