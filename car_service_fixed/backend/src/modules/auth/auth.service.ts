import {ConflictException, Injectable, NotFoundException, UnauthorizedException,} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {InjectRepository} from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import {Repository} from 'typeorm';
import {UserEntity, UserRole} from '../../entities/user.entity';
import {LoginDto, RegisterDto} from './dto/auth.dto';
import {AuthenticatedUser, JwtPayload} from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
        private readonly jwtService: JwtService,
    ) {
    }

    // ─── REGISTER ─────────────────────────────────────────────────────────────
    async register(dto: RegisterDto) {
        const exists = await this.userRepo.findOne({where: {email: dto.email}});
        if (exists) {
            throw new ConflictException('Bu email allaqachon ro\'yxatdan o\'tgan');
        }

        const hashed = await bcrypt.hash(dto.password, 12);

        const user = this.userRepo.create({
            email: dto.email,
            password: hashed,
            fullName: dto.fullName,
            phone: dto.phone,
            role: dto.role,
        });

        const saved = await this.userRepo.save(user);
        const token = await this.generateToken(saved, dto.workshopId);

        return {
            message: 'Muvaffaqiyatli ro\'yxatdan o\'tdingiz',
            user: this.sanitize(saved),
            accessToken: token,
        };
    }

    // ─── LOGIN ────────────────────────────────────────────────────────────────
    async login(dto: LoginDto) {
        // FIX: always do bcrypt compare even when user not found to prevent timing attacks
        const user = await this.userRepo.findOne({where: {email: dto.email}});
        const dummy = '$2a$12$dummyhashfortimingatttack000000000000000000000000000000';

        const passwordHash = user ? user.password : dummy;
        const isValid = await bcrypt.compare(dto.password, passwordHash);

        if (!user || !isValid) {
            throw new UnauthorizedException('Email yoki parol noto\'g\'ri');
        }

        const token = await this.generateToken(user, undefined);

        return {
            message: 'Muvaffaqiyatli kirildi',
            user: this.sanitize(user),
            accessToken: token,
        };
    }

    // ─── GET ME ───────────────────────────────────────────────────────────────
    async getMe(authUser: AuthenticatedUser) {
        const user = await this.userRepo.findOne({where: {id: authUser.userId}});
        if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');
        return this.sanitize(user);
    }

    // ─── PRIVATE ──────────────────────────────────────────────────────────────
    private async generateToken(user: UserEntity, workshopId?: string): Promise<string> {
        const needsWorkshop =
            user.role === UserRole.WORKSHOP_ADMIN || user.role === UserRole.MASTER;

        const payload: JwtPayload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            ...(needsWorkshop && workshopId ? {workshopId} : {}),
        };

        return this.jwtService.signAsync(payload);
    }

    private sanitize(user: UserEntity) {
        // FIX: use destructuring instead of delete to avoid mutating the entity
        const {password: _pw, ...rest} = user;
        return rest;
    }
}
