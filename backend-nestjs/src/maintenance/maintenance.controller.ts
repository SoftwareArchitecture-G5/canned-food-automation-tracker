import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { Maintenance } from "./entities/maintenance.entity";
import { ApiOperation, ApiParam, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';


@ApiTags('Maintenances')
@Controller('maintenances')
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new maintenance entry' })
  @ApiResponse({ status: 201, description: 'Maintenance entry created successfully', type: Maintenance })
  async create(@Body() createMaintenanceDto: CreateMaintenanceDto): Promise<Maintenance> {
    return this.maintenanceService.create(createMaintenanceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all maintenance entries' })
  @ApiResponse({ status: 200, description: 'List of all maintenance entries', type: [Maintenance] })
  async findAll(): Promise<Maintenance[]> {
    return this.maintenanceService.findAll();
  }
  
  @Get('date-range')
  @ApiOperation({ summary: 'Find maintenance records by date range' })
  @ApiQuery({ name: 'startDate', required: true, type: String, description: 'Start date in ISO format (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: true, type: String, description: 'End date in ISO format (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Maintenance records found', type: [Maintenance] })
  @ApiResponse({ status: 404, description: 'No maintenance records found in the specified date range' })
  async findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<Maintenance[]> {
    return this.maintenanceService.findByDateRange(startDate, endDate);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a maintenance entry by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Maintenance entry details', type: Maintenance })
  @ApiResponse({ status: 404, description: 'Maintenance entry not found' })
  async findOne(@Param('id') id: string): Promise<Maintenance> {
    return this.maintenanceService.findOne(id);
  }

  @Get('get-all-by-automation-id/:automationId')
  @ApiOperation({ summary: 'Get all maintenance entries by automation ID' })
  @ApiParam({ name: 'automationId', type: String })
  @ApiResponse({ status: 200, description: 'List of maintenance entries by automation ID', type: [Maintenance] })
  async findOneByAutomationId(@Param('automationId') automationId: string): Promise<Maintenance[]> {
    return this.maintenanceService.findAllByAutomationId(automationId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a maintenance entry' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Updated maintenance entry', type: Maintenance })
  async update(@Param('id') id: string, @Body() updateMaintenanceDto: UpdateMaintenanceDto): Promise<Maintenance> {
    return this.maintenanceService.update(id, updateMaintenanceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a maintenance entry' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Maintenance entry deleted', type: Maintenance })
  async remove(@Param('id') id: string): Promise<Maintenance> {
    return this.maintenanceService.remove(id);
  }
}
