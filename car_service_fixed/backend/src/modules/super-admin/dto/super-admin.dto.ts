import { IsEnum } from 'class-validator';
import { WorkshopStatus } from '../../../entities/workshop.entity';

export class UpdateWorkshopStatusDto {
    @IsEnum(WorkshopStatus, { message: 'Noto\'g\'ri status tanlandi' })
    status: WorkshopStatus;
}
