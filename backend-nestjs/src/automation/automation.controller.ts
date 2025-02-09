import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AutomationService } from './automation.service';
import { CreateAutomationDto } from './dto/create-automation.dto';
import { UpdateAutomationDto } from './dto/update-automation.dto';
import {Automation} from "./entities/automation.entity";


@Controller('automations')
export class AutomationController {
  constructor(private readonly automationService: AutomationService) {}

  @Post()
  async create(@Body() createAutomationDto: CreateAutomationDto): Promise<Automation> {
    return this.automationService.create(createAutomationDto);
  }

  @Get()
  async findAll(): Promise<Automation[]> {
    return this.automationService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Automation> {
    return this.automationService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateAutomationDto: UpdateAutomationDto): Promise<Automation> {
    return this.automationService.update(id, updateAutomationDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Automation> {
    return this.automationService.remove(id);
  }
}
