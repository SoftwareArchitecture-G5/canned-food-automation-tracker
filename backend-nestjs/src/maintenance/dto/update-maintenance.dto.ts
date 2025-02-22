import { PartialType } from '@nestjs/mapped-types';
import { CreateMaintenanceDto } from './create-maintenance.dto';
import { MaintenanceStatus } from "../entities/maintenance.entity";
import { IsDate, IsEnum, IsString, MaxLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMaintenanceDto extends PartialType(CreateMaintenanceDto) {
    @ApiProperty({ 
        description: "Updated date of maintenance",
        example: "2025-02-18T14:00:00.000Z"
    })
    @IsDate()
    readonly date?: Date;

    @ApiPropertyOptional({
        description: "Status of maintenance",
        enum: MaintenanceStatus,
        example: "pending"
    })
    @IsEnum(MaintenanceStatus)
    readonly status?: MaintenanceStatus;

    @ApiPropertyOptional({
        description: "Updated issue report",
        maxLength: 100,
        example: "Cooling system failure detected"
    })
    @IsString()
    @MaxLength(100)
    readonly issue_report?: string;
}
