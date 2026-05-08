import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../../entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthenticatedUser } from '../auth/interfaces/jwt-payload.interface';
import { SuperAdminService } from './super-admin.service';
import { UpdateWorkshopStatusDto } from './dto/super-admin.dto';

@ApiTags('super-admin')
@ApiBearerAuth('JWT-auth')
@Controller('super-admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN)
export class SuperAdminController {
    constructor(private readonly service: SuperAdminService) {}

    @Get('workshops')
    @ApiOperation({ summary: 'Barcha ustaxonalar ro\'yxati' })
    getWorkshops() {
        return this.service.getWorkshops();
    }

    @Patch('workshops/:id/status')
    @ApiOperation({ summary: 'Ustaxona holatini yangilash' })
    updateWorkshopStatus(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateWorkshopStatusDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.service.updateWorkshopStatus(id, dto, user);
    }

    @Get('users')
    @ApiOperation({ summary: 'Barcha foydalanuvchilar ro\'yxati' })
    getUsers() {
        return this.service.getUsers();
    }
}
