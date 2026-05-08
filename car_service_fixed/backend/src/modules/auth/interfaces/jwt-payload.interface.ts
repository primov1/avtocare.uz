import {UserRole} from "../../../entities/user.entity";

export interface JwtPayload {
    sub: string;        // userId
    email: string;
    role: UserRole;
    workshopId?: string; // faqat WORKSHOP_ADMIN va MASTER uchun
    iat?: number;
    exp?: number;
}

export interface AuthenticatedUser {
    userId: string;
    email: string;
    role: UserRole;
    workshopId?: string;
}
