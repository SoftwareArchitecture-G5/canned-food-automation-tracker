import { Injectable } from '@nestjs/common';
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

  findAll() {
    return this.blueprintRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} blueprint`;
  }

  update(id: number, updateBlueprintDto: UpdateBlueprintDto) {
    return `This action updates a #${id} blueprint`;
  }

  remove(id: number) {
    return `This action removes a #${id} blueprint`;
  }
}
