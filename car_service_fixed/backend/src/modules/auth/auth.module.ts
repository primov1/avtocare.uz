import {Module} from '@nestjs/common';
import {JwtModule} from '@nestjs/jwt';
import {PassportModule} from '@nestjs/passport';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {JWT_EXPIRES_IN, JWT_SECRET} from './constants/auth.constants';
import {JwtStrategy} from './strategies/jwt.strategy';
import {UserEntity} from "../../entities/user.entity";

@Module({
    imports: [
        // TypeORM — UserEntity bilan ishlash uchun
        TypeOrmModule.forFeature([UserEntity]),

        // Passport — JWT strategiyasi uchun
        PassportModule.register({defaultStrategy: 'jwt'}),

        // JWT moduli — token yaratish va tekshirish
        JwtModule.register({
            secret: JWT_SECRET,
            signOptions: {
                expiresIn: JWT_EXPIRES_IN,
            },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    // Boshqa modullar JwtAuthGuard va RolesGuard ishlatishi uchun export qilamiz
    exports: [AuthService, JwtModule, PassportModule],
})
export class AuthModule {
}
