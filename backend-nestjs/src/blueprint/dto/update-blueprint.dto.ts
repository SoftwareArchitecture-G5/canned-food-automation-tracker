import { PartialType } from '@nestjs/swagger';
import { CreateBlueprintDto } from './create-blueprint.dto';
import {IsArray, IsString} from "class-validator";

export class UpdateBlueprintDto extends PartialType(CreateBlueprintDto) {
    @IsString()
    name?: string;

    @IsArray()
    nodes?: any[];

    @IsArray()
    edges?: any[];
}
