import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import {Maintenance} from "./entities/maintenance.entity";

@Controller('maintenances')
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Post()
  async create(@Body() createMaintenanceDto: CreateMaintenanceDto): Promise<Maintenance> {
    return this.maintenanceService.create(createMaintenanceDto);
  }

  @Get()
  async findAll(): Promise<Maintenance[]> {
    return this.maintenanceService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Maintenance> {
    return this.maintenanceService.findOne(id);
  }

  @Get('get-all-by-automation-id/:automationId')
  async findOneByAutomationId(@Param('automationId') automationId: string): Promise<Maintenance[]> {
    return this.maintenanceService.findAllByAutomationId(automationId);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateMaintenanceDto: UpdateMaintenanceDto): Promise<Maintenance> {
    return this.maintenanceService.update(id, updateMaintenanceDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Maintenance> {
    return this.maintenanceService.remove(id);
  }
}
