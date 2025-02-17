import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AutomationService } from './automation.service';
import { CreateAutomationDto } from './dto/create-automation.dto';
import { UpdateAutomationDto } from './dto/update-automation.dto';
import { Automation } from "./entities/automation.entity";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('Automations')
@Controller('automations')
export class AutomationController {
  constructor(private readonly automationService: AutomationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new automation' })
  @ApiResponse({ status: 201, description: 'Automation created successfully', type: Automation })
  async create(@Body() createAutomationDto: CreateAutomationDto): Promise<Automation> {
    return this.automationService.create(createAutomationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all automations' })
  @ApiResponse({ status: 200, description: 'List of automations', type: [Automation] })
  async findAll(): Promise<Automation[]> {
    return this.automationService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an automation by ID' })
  @ApiParam({ name: 'id', type: String })
  async findOne(@Param('id') id: string): Promise<Automation> {
    return this.automationService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an automation' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Updated automation', type: Automation })
  async update(@Param('id') id: string, @Body() updateAutomationDto: UpdateAutomationDto): Promise<Automation> {
    return this.automationService.update(id, updateAutomationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an automation' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Automation deleted', type: Automation })
  async remove(@Param('id') id: string): Promise<Automation> {
    return this.automationService.remove(id);
  }
}
