import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiTags} from '@nestjs/swagger';
import {UserRole} from '../../entities/user.entity';
import {CurrentUser} from '../auth/decorators/current-user.decorator';
import {Roles} from '../auth/decorators/roles.decorator';
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard';
import {RolesGuard} from '../auth/guards/roles.guard';
import {AuthenticatedUser} from '../auth/interfaces/jwt-payload.interface';
import {AddVehicleDto, CreateAppointmentDto, FilterDriverAppointmentsDto, FilterWorkshopsDto,} from './dto/driver.dto';
import {DriverService} from './driver.service';

@ApiTags('driver')
@ApiBearerAuth('JWT-auth')
@Controller('driver')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.DRIVER)
export class DriverController {
    constructor(private readonly driverService: DriverService) {
    }

    // ── Virtual Garage ──────────────────────────────────────────────────────────
    @Post('vehicles')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({summary: 'Yangi mashina qo\'shish'})
    addVehicle(@Body() dto: AddVehicleDto, @CurrentUser() user: AuthenticatedUser) {
        return this.driverService.addVehicle(dto, user);
    }

    @Get('vehicles')
    @ApiOperation({summary: 'Mening mashinalarim'})
    getMyVehicles(@CurrentUser() user: AuthenticatedUser) {
        return this.driverService.getMyVehicles(user);
    }

    @Get('vehicles/:id')
    @ApiOperation({summary: 'Bitta mashina ma\'lumoti'})
    getVehicleById(
        @Param('id', ParseUUIDPipe) id: string,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.driverService.getVehicleById(id, user);
    }

    @Get('vehicles/:id/history')
    @ApiOperation({summary: 'Mashina servis tarixi'})
    getVehicleHistory(
        @Param('id', ParseUUIDPipe) id: string,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.driverService.getVehicleHistory(id, user);
    }

    // ── Workshops ───────────────────────────────────────────────────────────────
    @Get('workshops')
    @ApiOperation({summary: 'Ustaxonalar ro\'yxati'})
    getWorkshops(@Query() filters: FilterWorkshopsDto) {
        return this.driverService.getWorkshops(filters);
    }

    @Get('workshops/:id')
    @ApiOperation({summary: 'Bitta ustaxona ma\'lumoti'})
    getWorkshopById(@Param('id', ParseUUIDPipe) id: string) {
        return this.driverService.getWorkshopById(id);
    }

    // ── Booking ─────────────────────────────────────────────────────────────────
    @Post('appointments')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({summary: 'Navbat olish'})
    createAppointment(
        @Body() dto: CreateAppointmentDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.driverService.createAppointment(dto, user);
    }

    @Get('appointments')
    @ApiOperation({summary: 'Mening navbatlarim'})
    getMyAppointments(
        @CurrentUser() user: AuthenticatedUser,
        @Query() filters: FilterDriverAppointmentsDto,
    ) {
        return this.driverService.getMyAppointments(user, filters);
    }

    @Get('appointments/:id')
    @ApiOperation({summary: 'Bitta navbat tafsiloti'})
    getAppointmentById(
        @Param('id', ParseUUIDPipe) id: string,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.driverService.getAppointmentById(id, user);
    }

    @Patch('appointments/:id/cancel')
    @ApiOperation({summary: 'Navbatni bekor qilish'})
    cancelAppointment(
        @Param('id', ParseUUIDPipe) id: string,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.driverService.cancelAppointment(id, user);
    }
}
