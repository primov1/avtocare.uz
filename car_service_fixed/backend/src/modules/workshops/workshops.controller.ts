import {
    Body,
    Controller,
    ForbiddenException,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiTags} from '@nestjs/swagger';
import {UserRole} from '../../entities/user.entity';
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard';
import {RolesGuard} from '../auth/guards/roles.guard';
import {CurrentUser} from '../auth/decorators/current-user.decorator';
import {Roles} from '../auth/decorators/roles.decorator';
import {AuthenticatedUser} from '../auth/interfaces/jwt-payload.interface';
import {CreateServiceHistoryDto, FilterAppointmentsDto, UpdateAppointmentStatusDto,} from './dto/workshop.dto';
import {WorkshopsService} from './workshops.service';

@ApiTags('workshop')
@ApiBearerAuth('JWT-auth')
@Controller('workshop')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.WORKSHOP_ADMIN, UserRole.MASTER)
export class WorkshopsController {
    constructor(private readonly workshopsService: WorkshopsService) {
    }

    // FIX: extracted helper as private method is not supported in NestJS controllers
    // Use inline check instead
    private requireWorkshop(user: AuthenticatedUser): string {
        if (!user.workshopId) {
            throw new ForbiddenException('Siz hali birorta ustaxonaga biriktirilmagansiz');
        }
        return user.workshopId;
    }

    @Get('me')
    @ApiOperation({summary: 'Mening ustaxonam ma\'lumotlari'})
    getMyWorkshop(@CurrentUser() user: AuthenticatedUser) {
        return this.workshopsService.getMyWorkshop(this.requireWorkshop(user));
    }

    @Get('stats')
    @Roles(UserRole.WORKSHOP_ADMIN)
    @ApiOperation({summary: 'Dashboard statistikasi'})
    getStats(@CurrentUser() user: AuthenticatedUser) {
        return this.workshopsService.getWorkshopStats(this.requireWorkshop(user));
    }

    @Get('appointments')
    @ApiOperation({summary: 'Navbatlar ro\'yxati (filter bilan)'})
    getAppointments(
        @CurrentUser() user: AuthenticatedUser,
        @Query() filters: FilterAppointmentsDto,
    ) {
        return this.workshopsService.getAppointments(this.requireWorkshop(user), filters, user);
    }

    @Patch('appointments/:id/status')
    @ApiOperation({summary: 'Navbat statusini yangilash'})
    updateStatus(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateAppointmentStatusDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.workshopsService.updateAppointmentStatus(id, dto, this.requireWorkshop(user), user);
    }

    @Post('service-history')
    @ApiOperation({summary: 'Servis tarixi qo\'shish'})
    createServiceHistory(
        @Body() dto: CreateServiceHistoryDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.workshopsService.createServiceHistory(dto, this.requireWorkshop(user), user);
    }

    @Get('masters')
    @Roles(UserRole.WORKSHOP_ADMIN)
    @ApiOperation({summary: 'Ustaxona ustalari ro\'yxati'})
    getMasters(@CurrentUser() user: AuthenticatedUser) {
        return this.workshopsService.getMasters(this.requireWorkshop(user));
    }

    @Get('vehicle/:vehicleId/history')
    @ApiOperation({summary: 'Mashina servis tarixi'})
    getVehicleHistory(
        @Param('vehicleId', ParseUUIDPipe) vehicleId: string,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.workshopsService.getVehicleHistory(vehicleId, this.requireWorkshop(user));
    }
}
