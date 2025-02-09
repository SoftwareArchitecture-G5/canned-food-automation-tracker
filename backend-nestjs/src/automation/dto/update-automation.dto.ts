import { PartialType } from '@nestjs/mapped-types';
import { CreateAutomationDto } from './create-automation.dto';
import {AutomationStatus} from "../entities/automation.entity";
import {IsEnum, IsString, MaxLength} from "class-validator";

export class UpdateAutomationDto extends PartialType(CreateAutomationDto) {
    @IsString()
    @MaxLength(50)
    readonly name?: string;

    @IsString()
    @MaxLength(100)
    readonly description?: string;

    @IsEnum(AutomationStatus)
    readonly status?: AutomationStatus;
}