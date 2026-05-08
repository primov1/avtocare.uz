import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

// ─── Add Vehicle ─────────────────────────────────────────────────────────────
export class AddVehicleDto {
  @IsString()
  @IsNotEmpty({ message: 'Mashina markasi kiritilishi shart' })
  make: string; // Toyota, Chevrolet...

  @IsString()
  @IsNotEmpty({ message: 'Mashina modeli kiritilishi shart' })
  model: string; // Cobalt, Malibu...

  @IsString()
  @IsNotEmpty({ message: 'Davlat raqami kiritilishi shart' })
  @MaxLength(10)
  plateNumber: string; // 01A123BC

  @IsOptional()
  @IsString()
  @MinLength(17, { message: 'VIN 17 ta belgidan iborat bo\'lishi kerak' })
  @MaxLength(17)
  vin?: string;

  @IsOptional()
  year?: number;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  currentMileage?: number;
}

// ─── Create Appointment ───────────────────────────────────────────────────────
export class CreateAppointmentDto {
  @IsUUID('4', { message: 'vehicleId UUID formatida bo\'lishi kerak' })
  vehicleId: string;

  @IsUUID('4', { message: 'workshopId UUID formatida bo\'lishi kerak' })
  workshopId: string;

  @IsDateString({}, { message: 'Sana ISO format bo\'lishi kerak (2024-12-01T10:00:00Z)' })
  date: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string; // Mijozning izohi

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  problemDescription?: string; // Muammo tavsifi
}

// ─── Filter Workshops ─────────────────────────────────────────────────────────
export class FilterWorkshopsDto {
  @IsOptional()
  @IsString()
  city?: string; // Shahar bo'yicha qidirish

  @IsOptional()
  @IsString()
  search?: string; // Ism bo'yicha qidirish
}

// ─── Filter Driver Appointments ───────────────────────────────────────────────
export class FilterDriverAppointmentsDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsUUID('4')
  vehicleId?: string;
}
