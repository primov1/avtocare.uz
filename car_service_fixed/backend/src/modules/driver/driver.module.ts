import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AppointmentEntity} from '../../entities/appointment.entity';
import {ServiceHistoryEntity} from '../../entities/service-history.entity';
import {VehicleEntity} from '../../entities/vehicle.entity';
import {WorkshopEntity} from '../../entities/workshop.entity';
import {AuthModule} from '../auth/auth.module';
import {DriverController} from './driver.controller';
import {DriverService} from './driver.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            VehicleEntity,
            AppointmentEntity,
            ServiceHistoryEntity,
            WorkshopEntity,
        ]),
        AuthModule,
    ],
    controllers: [DriverController],
    providers: [DriverService],
    exports: [DriverService],
})
export class DriverModule {
}
