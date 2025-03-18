import { IsString, IsArray, IsNotEmpty } from 'class-validator';

export class CreateBlueprintDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsArray()
    nodes: any[];

    @IsArray()
    edges: any[];
}
