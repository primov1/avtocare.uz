import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';
import { ShopItemEntity } from '../../entities/shop-item.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([ShopItemEntity]),
        AuthModule,
    ],
    controllers: [ShopController],
    providers: [ShopService],
    exports: [ShopService],
})
export class ShopModule {}
