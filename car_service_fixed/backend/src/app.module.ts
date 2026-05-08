import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AppointmentEntity} from './entities/appointment.entity';
import {ServiceHistoryEntity} from './entities/service-history.entity';
import {ShopItemEntity} from './entities/shop-item.entity';
import {UserEntity} from './entities/user.entity';
import {VehicleEntity} from './entities/vehicle.entity';
import {WorkshopEntity} from './entities/workshop.entity';
import {AuthModule} from './modules/auth/auth.module';
import {DriverModule} from './modules/driver/driver.module';
import {SuperAdminModule} from './modules/super-admin/super-admin.module';
import {WorkshopsModule} from './modules/workshops/workshops.module';
import {ShopModule} from './modules/shop/shop.module';

@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true}),

        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432'),
            username: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || '1111',
            database: process.env.DB_NAME || 'project',
            entities: [
                UserEntity,
                WorkshopEntity,
                VehicleEntity,
                AppointmentEntity,
                ServiceHistoryEntity,
                ShopItemEntity,
            ],
            // FIX: synchronize only in development; never in production
            synchronize: process.env.NODE_ENV !== 'production',
            logging: process.env.NODE_ENV === 'development',
        }),

        AuthModule,
        WorkshopsModule,
        DriverModule,
        SuperAdminModule,
        ShopModule,
    ],
})
export class AppModule {
}
