import { IsDate, IsString, IsUUID, MaxLength } from "class-validator";
import { Optional } from "@nestjs/common";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateMaintenanceDto {
    @ApiProperty({
        description: "UUID of the automation",
        example: "550e8400-e29b-41d4-a716-446655440000"
    })
    @IsUUID()
    readonly automation_id: string;

    @ApiPropertyOptional({
        description: "Date of maintenance",
        example: "2025-02-17T12:00:00.000Z"
    })
    @IsDate()
    @Optional()
    readonly date?: Date;

    @ApiPropertyOptional({
        description: "Issue report",
        maxLength: 100,
        example: "Motor overheating detected"
    })
    @IsString()
    @Optional()
    @MaxLength(100)
    readonly issue_report?: string
}
