import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Logger} from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { Maintenance } from "./entities/maintenance.entity";
import { ApiOperation, ApiParam, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import {JwtAuthGuard} from "../auth/jwt-auth.guard";


@ApiTags('Maintenances')
@Controller('maintenances')
export class MaintenanceController {
  private readonly logger = new Logger(MaintenanceController.name);

  constructor(private readonly maintenanceService: MaintenanceService) {
    this.logger.log('MaintenanceController initialized');
  }

  @Post()
  @ApiOperation({ summary: 'Create a new maintenance entry' })
  @ApiResponse({ status: 201, description: 'Maintenance entry created successfully', type: Maintenance })
  @UseGuards(JwtAuthGuard)
  async create(@Body() createMaintenanceDto: CreateMaintenanceDto): Promise<Maintenance> {
    this.logger.log(`Creating maintenance entry for automation ID: ${createMaintenanceDto.automation_id}`);
    try {
      const result = await this.maintenanceService.create(createMaintenanceDto);
      this.logger.log(`Maintenance entry created with ID: ${result.maintenance_id}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to create maintenance entry: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all maintenance entries' })
  @ApiResponse({ status: 200, description: 'List of all maintenance entries', type: [Maintenance] })
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<Maintenance[]> {
    this.logger.log('Retrieving all maintenance entries');
    try {
      const results = await this.maintenanceService.findAll();
      this.logger.log(`Retrieved ${results.length} maintenance entries`);
      return results;
    } catch (error) {
      this.logger.error(`Failed to retrieve maintenance entries: ${error.message}`, error.stack);
      throw error;
    }
  }
  
  @Get('date-range')
  @ApiOperation({ summary: 'Find maintenance records by date range' })
  @ApiQuery({ name: 'startDate', required: true, type: String, description: 'Start date in ISO format (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: true, type: String, description: 'End date in ISO format (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Maintenance records found', type: [Maintenance] })
  @ApiResponse({ status: 404, description: 'No maintenance records found in the specified date range' })
  @UseGuards(JwtAuthGuard)
  async findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<Maintenance[]> {
    this.logger.log(`Retrieving maintenance entries between ${startDate} and ${endDate}`);
    try {
      const results = await this.maintenanceService.findByDateRange(startDate, endDate);
      this.logger.log(`Retrieved ${results.length} maintenance entries in date range`);
      return results;
    } catch (error) {
      this.logger.error(`Failed to retrieve maintenance entries by date range: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a maintenance entry by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Maintenance entry details', type: Maintenance })
  @ApiResponse({ status: 404, description: 'Maintenance entry not found' })
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string): Promise<Maintenance> {
    this.logger.log(`Retrieving maintenance entry with ID: ${id}`);
    try {
      const result = await this.maintenanceService.findOne(id);
      this.logger.log(`Retrieved maintenance entry: ${id}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to retrieve maintenance entry ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get('get-all-by-automation-id/:automationId')
  @ApiOperation({ summary: 'Get all maintenance entries by automation ID' })
  @ApiParam({ name: 'automationId', type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of maintenance entries by automation ID', type: [Maintenance] })
  @UseGuards(JwtAuthGuard)
  async findOneByAutomationId(
    @Param('automationId') automationId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<Maintenance[]> {
    this.logger.log(`Retrieving maintenance entries for automation ID: ${automationId} (page: ${page}, limit: ${limit})`);
    try {
      const results = await this.maintenanceService.findAllByAutomationId(automationId, page, limit);
      this.logger.log(`Retrieved ${results.length} maintenance entries for automation ID: ${automationId}`);
      return results;
    } catch (error) {
      this.logger.error(`Failed to retrieve maintenance entries for automation ${automationId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a maintenance entry' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Updated maintenance entry', type: Maintenance })
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateMaintenanceDto: UpdateMaintenanceDto): Promise<Maintenance> {
    this.logger.log(`Updating maintenance entry with ID: ${id}`);
    try {
      const result = await this.maintenanceService.update(id, updateMaintenanceDto);
      this.logger.log(`Maintenance entry ${id} updated successfully`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to update maintenance entry ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a maintenance entry' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Maintenance entry deleted', type: Maintenance })
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string): Promise<Maintenance> {
    this.logger.log(`Deleting maintenance entry with ID: ${id}`);
    try {
      const result = await this.maintenanceService.remove(id);
      this.logger.log(`Maintenance entry ${id} deleted successfully`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to delete maintenance entry ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
}