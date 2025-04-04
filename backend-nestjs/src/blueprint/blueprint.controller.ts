import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Logger} from '@nestjs/common';
import { BlueprintService } from './blueprint.service';
import { CreateBlueprintDto } from './dto/create-blueprint.dto';
import { UpdateBlueprintDto } from './dto/update-blueprint.dto';
import {Blueprint} from "./entities/blueprint.entity";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";

@Controller('blueprint')
export class BlueprintController {
  private readonly logger = new Logger(BlueprintController.name);

  constructor(private readonly blueprintService: BlueprintService) {
    this.logger.log('BlueprintController initialized');
  }

  @Post('/save')
  async create(@Body() createBlueprintDto: CreateBlueprintDto): Promise<Blueprint> {
    this.logger.log(`Creating blueprint with name: ${createBlueprintDto.name}`);
    try {
      const result = await this.blueprintService.create(createBlueprintDto);
      this.logger.log(`Blueprint created with ID: ${result.blueprint_id}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to create blueprint: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    this.logger.log('Retrieving all blueprints');
    try {
      const results = await this.blueprintService.findAll();
      this.logger.log(`Retrieved ${results.length} blueprints`);
      return results;
    } catch (error) {
      this.logger.error(`Failed to retrieve blueprints: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    this.logger.log(`Retrieving blueprint with ID: ${id}`);
    try {
      const result = await this.blueprintService.findOne(id);
      this.logger.log(`Retrieved blueprint: ${result.name} (ID: ${id})`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to retrieve blueprint ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateBlueprintDto: UpdateBlueprintDto) {
    this.logger.log(`Updating blueprint with ID: ${id}`);
    try {
      const result = await this.blueprintService.update(id, updateBlueprintDto);
      this.logger.log(`Blueprint ${id} updated successfully`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to update blueprint ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    this.logger.log(`Deleting blueprint with ID: ${id}`);
    try {
      const result = await this.blueprintService.remove(id);
      this.logger.log(`Blueprint ${id} deleted successfully`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to delete blueprint ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
}