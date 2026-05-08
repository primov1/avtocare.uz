import {Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards,} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiTags} from '@nestjs/swagger';
import {AuthService} from './auth.service';
import {CurrentUser} from './decorators/current-user.decorator';
import {LoginDto, RegisterDto} from './dto/auth.dto';
import {JwtAuthGuard} from './guards/jwt-auth.guard';
import {AuthenticatedUser} from './interfaces/jwt-payload.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({summary: 'Yangi foydalanuvchi ro\'yxatdan o\'tkazish'})
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({summary: 'Tizimga kirish — JWT token qaytaradi'})
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({summary: 'Joriy foydalanuvchi ma\'lumotlari'})
    getMe(@CurrentUser() user: AuthenticatedUser) {
        return this.authService.getMe(user);
    }
}
