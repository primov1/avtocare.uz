import {IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID, Min,} from 'class-validator';
import {AppointmentStatus} from "../../../entities/appointment.entity";

// ─── Update Appointment Status ───────────────────────────────────────────────
export class UpdateAppointmentStatusDto {
    @IsEnum(AppointmentStatus, {
        message: `Status quyidagilardan biri bo'lishi kerak: ${Object.values(AppointmentStatus).join(', ')}`,
    })
    status: AppointmentStatus;

    @IsOptional()
    @IsUUID('4')
    masterId?: string; // Navbatni ustaga biriktirish uchun
}

// ─── Create Service History ───────────────────────────────────────────────────
export class CreateServiceHistoryDto {
    @IsUUID('4', {message: 'vehicleId UUID formatida bo\'lishi kerak'})
    vehicleId: string;

    @IsOptional()
    @IsUUID('4', {message: 'appointmentId UUID formatida bo\'lishi kerak'})
    appointmentId?: string;

    @IsString()
    @IsNotEmpty({message: 'Tavsif kiritilishi shart'})
    description: string; // Bajarilgan ishlar

    @IsNumber({maxDecimalPlaces: 2}, {message: 'Narx raqam bo\'lishi kerak'})
    @IsPositive({message: 'Narx musbat bo\'lishi kerak'})
    cost: number;

    @IsOptional()
    @IsInt({message: 'Probeg butun son bo\'lishi kerak'})
    @Min(0)
    mileage?: number; // Servis vaqtidagi probeg

    @IsOptional()
    @IsString()
    partsUsed?: string; // Ishlatilgan ehtiyot qismlar

    @IsOptional()
    @IsInt()
    @Min(0)
    nextServiceMileage?: number; // Keyingi servis uchun probeg

    @IsOptional()
    @IsString()
    nextServiceDate?: string; // ISO date string
}

// ─── Filter Appointments ─────────────────────────────────────────────────────
export class FilterAppointmentsDto {
    @IsOptional()
    @IsEnum(AppointmentStatus)
    status?: AppointmentStatus;

    @IsOptional()
    @IsUUID('4')
    masterId?: string;

    @IsOptional()
    @IsString()
    date?: string; // YYYY-MM-DD
}
