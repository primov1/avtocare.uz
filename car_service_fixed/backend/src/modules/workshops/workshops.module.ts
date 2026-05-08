import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AppointmentEntity} from '../../entities/appointment.entity';
import {ServiceHistoryEntity} from '../../entities/service-history.entity';
import {UserEntity} from '../../entities/user.entity';
import {VehicleEntity} from '../../entities/vehicle.entity';
import {WorkshopEntity} from '../../entities/workshop.entity';
import {AuthModule} from '../auth/auth.module';
import {WorkshopsController} from './workshops.controller';
import {WorkshopsService} from './workshops.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            WorkshopEntity,
            AppointmentEntity,
            ServiceHistoryEntity,
            UserEntity,
            VehicleEntity,
        ]),
        AuthModule, // JwtAuthGuard va RolesGuard uchun
    ],
    controllers: [WorkshopsController],
    providers: [WorkshopsService],
    exports: [WorkshopsService],
})
export class WorkshopsModule {
}
