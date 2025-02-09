import { PartialType } from '@nestjs/mapped-types';
import { CreateMaintenanceDto } from './create-maintenance.dto';
import {MaintenanceStatus} from "../entities/maintenance.entity";
import {IsDate, IsEnum, IsString, MaxLength} from "class-validator";

export class UpdateMaintenanceDto extends PartialType(CreateMaintenanceDto) {
    @IsDate()
    readonly date?: Date;

    @IsEnum(MaintenanceStatus)
    readonly status?: MaintenanceStatus;

    @IsString()
    @MaxLength(100)
    readonly issue_report?: string;
}
