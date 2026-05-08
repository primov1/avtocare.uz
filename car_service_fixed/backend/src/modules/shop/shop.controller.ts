import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../../entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthenticatedUser } from '../auth/interfaces/jwt-payload.interface';
import { ShopService } from './shop.service';
import { CreateInventoryItemDto, UpdateInventoryItemDto } from './dto/shop.dto';

@ApiTags('shop')
@ApiBearerAuth('JWT-auth')
@Controller('shop')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ShopController {
    constructor(private readonly shopService: ShopService) {}

    @Post('inventory')
    @Roles(UserRole.STORE_OWNER)
    @ApiOperation({ summary: 'Inventarni qo\'shish' })
    createItem(
        @CurrentUser() user: AuthenticatedUser,
        @Body() dto: CreateInventoryItemDto,
    ) {
        return this.shopService.createItem(dto, user);
    }

    @Get('inventory')
    @Roles(UserRole.STORE_OWNER)
    @ApiOperation({ summary: 'O\'z inventaringizni ko\'rish' })
    getInventory(@CurrentUser() user: AuthenticatedUser) {
        return this.shopService.getInventory(user);
    }

    @Patch('inventory/:id')
    @Roles(UserRole.STORE_OWNER)
    @ApiOperation({ summary: 'Inventar elementini yangilash' })
    updateItem(
        @Param('id', ParseUUIDPipe) id: string,
        @CurrentUser() user: AuthenticatedUser,
        @Body() dto: UpdateInventoryItemDto,
    ) {
        return this.shopService.updateItem(id, dto, user);
    }

    @Get('catalog')
    @ApiOperation({ summary: 'Jamoat katalogi (barcha ommaviy mahsulotlar)' })
    getCatalog() {
        return this.shopService.getCatalog();
    }
}
