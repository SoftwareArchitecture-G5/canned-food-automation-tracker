import {IsNotEmpty, IsOptional, IsString, MaxLength} from "class-validator";

export class CreateAutomationDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    readonly name: string;

    @IsString()
    @IsOptional()
    @MaxLength(100)
    readonly description?: string;
}