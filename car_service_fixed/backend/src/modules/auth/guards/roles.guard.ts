import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../constants/auth.constants';
import { AuthenticatedUser } from '../interfaces/jwt-payload.interface';
import {UserRole} from "../../../entities/user.entity";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Endpoint uchun talab qilingan rollarni olish
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Agar @Roles() decorator yo'q bo'lsa — hamma kirishi mumkin
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: AuthenticatedUser = request.user;

    if (!user) {
      throw new ForbiddenException('Foydalanuvchi autentifikatsiyadan o\'tmagan');
    }

    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole) {
      throw new ForbiddenException(
        `Bu amalni bajarish uchun sizda huquq yo'q. Talab qilingan rol: [${requiredRoles.join(', ')}]`,
      );
    }

    return true;
  }
}
