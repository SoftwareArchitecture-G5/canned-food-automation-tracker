import {Query, Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Logger} from '@nestjs/common';
import { AutomationService } from './automation.service';
import { CreateAutomationDto } from './dto/create-automation.dto';
import { UpdateAutomationDto } from './dto/update-automation.dto';
import { Automation } from "./entities/automation.entity";
import { ApiQuery, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import {JwtAuthGuard} from "../auth/jwt-auth.guard";


@ApiTags('Automations')
@Controller('automations')
export class AutomationController {
  private readonly logger = new Logger(AutomationController.name);

  constructor(private readonly automationService: AutomationService) {
    this.logger.log('AutomationController initialized');
  }

  @Post()
  @ApiOperation({ summary: 'Create a new automation' })
  @ApiResponse({ status: 201, description: 'Automation created successfully', type: Automation })
  @UseGuards(JwtAuthGuard)
  async create(@Body() createAutomationDto: CreateAutomationDto): Promise<Automation> {
    this.logger.log(`Creating automation with name: ${createAutomationDto.name}`);
    try {
      const result = await this.automationService.create(createAutomationDto);
      this.logger.log(`Automation created with ID: ${result.automation_id}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to create automation: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all automations with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'List of automations with pagination',
    schema: {
      example: {
        data: [ /* automation objects */ ],
        total: 35
      }
    }
  })
  @UseGuards(JwtAuthGuard)
  async findAllPagination(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ): Promise<{ data: Automation[]; total: number }> {
    this.logger.log(`Retrieving paginated automations (page: ${page}, limit: ${limit})`);
    try {
      const result = await this.automationService.findAllPaginated(Number(page), Number(limit));
      this.logger.log(`Retrieved ${result.data.length} automations (total: ${result.total})`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to retrieve paginated automations: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get("all")
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<Automation[]> {
    this.logger.log('Retrieving all automations');
    try {
      const results = await this.automationService.findAll();
      this.logger.log(`Retrieved ${results.length} automations`);
      return results;
    } catch (error) {
      this.logger.error(`Failed to retrieve all automations: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an automation by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Get automation by ID', type: Automation })
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string): Promise<Automation> {
    this.logger.log(`Retrieving automation with ID: ${id}`);
    try {
      const result = await this.automationService.findOne(id);
      this.logger.log(`Retrieved automation: ${result.name} (ID: ${id})`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to retrieve automation ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an automation' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Updated automation', type: Automation })
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateAutomationDto: UpdateAutomationDto): Promise<Automation> {
    this.logger.log(`Updating automation with ID: ${id}`);
    try {
      const result = await this.automationService.update(id, updateAutomationDto);
      this.logger.log(`Automation ${id} updated successfully`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to update automation ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an automation' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Automation deleted', type: Automation })
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string): Promise<Automation> {
    this.logger.log(`Deleting automation with ID: ${id}`);
    try {
      const result = await this.automationService.remove(id);
      this.logger.log(`Automation ${id} deleted successfully`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to delete automation ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
}