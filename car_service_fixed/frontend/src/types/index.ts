// ─── Enums ────────────────────────────────────────────────────────────────────
export type UserRole =
    | 'SUPER_ADMIN'
    | 'WORKSHOP_ADMIN'
    | 'MASTER'
    | 'DRIVER'
    | 'STORE_OWNER';

export type AppointmentStatus =
    | 'pending'
    | 'confirmed'
    | 'in_progress'
    | 'completed'
    | 'cancelled';

export type WorkshopStatus = 'pending' | 'approved' | 'rejected';

// ─── Entities ─────────────────────────────────────────────────────────────────
export interface User {
    id: string;
    email: string;
    fullName: string;
    phone?: string;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
}

export interface Workshop {
    id: string;
    name: string;
    address: string;
    phone: string;
    description?: string;
    status: WorkshopStatus;
    createdAt: string;
}

export interface Vehicle {
    id: string;
    make: string;
    model: string;
    plateNumber: string;
    vin?: string;
    year?: number;
    color?: string;
    currentMileage?: number;
    ownerId: string;
    createdAt: string;
}

export interface Appointment {
    id: string;
    date: string;
    status: AppointmentStatus;
    notes?: string;
    problemDescription?: string;
    driverId: string;
    vehicleId: string;
    workshopId: string;
    masterId?: string;
    driver?: User;
    vehicle?: Vehicle;
    workshop?: Workshop;
    master?: User;
    createdAt: string;
}

export interface ServiceHistory {
    id: string;
    description: string;
    cost: number;
    mileage?: number;
    partsUsed?: string;
    nextServiceMileage?: number;
    nextServiceDate?: string;
    vehicleId: string;
    workshopId: string;
    appointmentId?: string;
    vehicle?: Vehicle;
    workshop?: Workshop;
    createdAt: string;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface AuthResponse {
    message: string;
    user: User;
    accessToken: string;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    role: UserRole;
    workshopId?: string;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export interface WorkshopStats {
    appointments: { total: number; pending: number; inProgress: number; completed: number };
    monthlyRevenue: number;
}
