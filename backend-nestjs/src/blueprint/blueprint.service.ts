import {Injectable, NotFoundException, Logger} from '@nestjs/common';
import { CreateBlueprintDto } from './dto/create-blueprint.dto';
import { UpdateBlueprintDto } from './dto/update-blueprint.dto';
import {Blueprint} from "./entities/blueprint.entity";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class BlueprintService {
  private readonly logger = new Logger(BlueprintService.name);

  constructor(
      @InjectRepository(Blueprint)
      private readonly blueprintRepository: Repository<Blueprint>,
  ) {
    this.logger.log('BlueprintService initialized');
  }

  async create(createBlueprintDto: CreateBlueprintDto): Promise<Blueprint> {
    this.logger.log(`Creating new blueprint with name: ${createBlueprintDto.name}`);
    try {
      const blueprint = this.blueprintRepository.create(createBlueprintDto);
      const result = await this.blueprintRepository.save(blueprint);
      this.logger.log(`Blueprint created with ID: ${result.blueprint_id}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to create blueprint: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(): Promise<Blueprint[]> {
    this.logger.log('Finding all blueprints');
    try {
      const blueprints = await this.blueprintRepository.find();
      this.logger.log(`Found ${blueprints.length} blueprints`);
      return blueprints;
    } catch (error) {
      this.logger.error(`Failed to find all blueprints: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: string): Promise<Blueprint> {
    this.logger.log(`Finding blueprint with ID: ${id}`);
    try {
      const blueprint: Blueprint|null = await this.blueprintRepository.findOne({
        where: {blueprint_id: id}
      });
      
      if (!blueprint) {
        this.logger.warn(`Blueprint with ID ${id} not found`);
        throw new NotFoundException(`No such blueprint with id ${id}`);
      }
      
      this.logger.log(`Found blueprint: ${blueprint.name} (ID: ${blueprint.blueprint_id})`);
      return blueprint;
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        this.logger.error(`Error finding blueprint with ID ${id}: ${error.message}`, error.stack);
      }
      throw error;
    }
  }

  async update(id: string, updateBlueprintDto: UpdateBlueprintDto) {
    this.logger.log(`Updating blueprint with ID: ${id}`);
    try {
      const blueprint = await this.findOne(id);
      this.logger.debug(`Found blueprint to update: ${blueprint.name}`);
      
      const updatedBlueprint = Object.assign(blueprint, updateBlueprintDto);
      const result = await this.blueprintRepository.save(updatedBlueprint);
      
      this.logger.log(`Blueprint ${id} updated successfully`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to update blueprint ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: string) {
    this.logger.log(`Removing blueprint with ID: ${id}`);
    try {
      const blueprint = await this.findOne(id);
      this.logger.debug(`Found blueprint to remove: ${blueprint.name}`);
      
      const result = await this.blueprintRepository.remove(blueprint);
      this.logger.log(`Blueprint ${id} removed successfully`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to remove blueprint ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
}