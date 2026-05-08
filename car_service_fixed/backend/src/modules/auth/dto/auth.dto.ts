import {IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MinLength,} from 'class-validator';
import {UserRole} from "../../../entities/user.entity";

export class RegisterDto {
    @IsEmail({}, {message: 'Noto\'g\'ri email format'})
    email: string;

    @IsString()
    @MinLength(6, {message: 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak'})
    password: string;

    @IsString()
    @IsNotEmpty({message: 'To\'liq ism kiritilishi shart'})
    fullName: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsEnum(UserRole, {message: 'Noto\'g\'ri rol tanlandi'})
    role: UserRole;

    // WORKSHOP_ADMIN yoki MASTER bo'lsa, workshopId ixtiyoriy
    @IsOptional()
    @IsUUID('4', {message: 'WorkshopId UUID formatida bo\'lishi kerak'})
    workshopId?: string;
}

export class LoginDto {
    @IsEmail({}, {message: 'Noto\'g\'ri email format'})
    email: string;

    @IsString()
    @IsNotEmpty({message: 'Parol kiritilishi shart'})
    password: string;
}
