import {IsDate, IsString, IsUUID, MaxLength} from "class-validator";
import {Optional} from "@nestjs/common";

export class CreateMaintenanceDto {
    @IsUUID()
    readonly automation_id: string;

    @IsDate()
    @Optional()
    readonly date?: Date;

    @IsString()
    @Optional()
    @MaxLength(100)
    readonly issue_report?: string
}
