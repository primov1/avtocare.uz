import {SetMetadata} from '@nestjs/common';
import {ROLES_KEY} from '../constants/auth.constants';
import {UserRole} from "../../../entities/user.entity";

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
