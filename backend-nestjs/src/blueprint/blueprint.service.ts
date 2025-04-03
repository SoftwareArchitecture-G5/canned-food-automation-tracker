import {Injectable, NotFoundException} from '@nestjs/common';
import { CreateBlueprintDto } from './dto/create-blueprint.dto';
import { UpdateBlueprintDto } from './dto/update-blueprint.dto';
import {Blueprint} from "./entities/blueprint.entity";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class BlueprintService {
  constructor(
      @InjectRepository(Blueprint)
      private readonly blueprintRepository: Repository<Blueprint>,
  ) {
  }
  async create(createBlueprintDto: CreateBlueprintDto): Promise<Blueprint> {
    const blueprint = this.blueprintRepository.create(createBlueprintDto);
    return await this.blueprintRepository.save(blueprint);
  }

  async findAll(): Promise<Blueprint[]> {
    return this.blueprintRepository.find();
  }

  async findOne(id: string): Promise<Blueprint> {
    const blueprint: Blueprint|null = await this.blueprintRepository.findOne({
      where: {blueprint_id: id}
    })
    if (!blueprint) {
      throw new NotFoundException(`No such blueprint with id ${id}`);
    }
    return blueprint;
  }

  async update(id: string, updateBlueprintDto: UpdateBlueprintDto) {
    const blueprint = await this.findOne(id);
    const updatedBlueprint = Object.assign(blueprint, updateBlueprintDto);
    return await this.blueprintRepository.save(updatedBlueprint);
  }

  async remove(id: string) {
    const blueprint = await this.findOne(id);
    return await this.blueprintRepository.remove(blueprint);
  }
}
