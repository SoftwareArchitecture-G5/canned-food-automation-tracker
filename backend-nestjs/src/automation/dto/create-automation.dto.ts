import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateAutomationDto {
    @ApiProperty({
        description: "Name of the automation machine", 
        example: 'CNC Machine 1',
        maxLength: 50, 
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    readonly name: string;

    @ApiPropertyOptional({
        description: "Description of the automation machine",
        example: 'An automatic machine for transforming material into a specified shape',
        maxLength: 100, 
    })
    @IsString()
    @IsOptional()
    @MaxLength(100)
    readonly description?: string;
}