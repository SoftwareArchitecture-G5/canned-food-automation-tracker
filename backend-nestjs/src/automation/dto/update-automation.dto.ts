import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateAutomationDto } from './create-automation.dto';
import { AutomationStatus } from "../entities/automation.entity";
import { IsEnum, IsString, MaxLength } from "class-validator";

export class UpdateAutomationDto extends PartialType(CreateAutomationDto) {
    @ApiPropertyOptional({ 
        description: "Name of the automation machine", 
        maxLength: 50, 
        example: "CNC Machine 1"
    })
    @IsString()
    @MaxLength(50)
    readonly name?: string;

    @ApiPropertyOptional({ 
        description: "Description of the automation machine", 
        maxLength: 100, 
        example: "An automatic machine for transforming material into a specified shape."
    })
    @IsString()
    @MaxLength(100)
    readonly description?: string;

    @ApiPropertyOptional({ 
        description: "Status of the automation machine", 
        enum: AutomationStatus, 
        example: AutomationStatus.ACTIVE
    })
    @IsEnum(AutomationStatus)
    readonly status?: AutomationStatus;
}
