import {Query, Controller, Get, Post, Body, Patch, Param, Delete, UseGuards} from '@nestjs/common';
import { AutomationService } from './automation.service';
import { CreateAutomationDto } from './dto/create-automation.dto';
import { UpdateAutomationDto } from './dto/update-automation.dto';
import { Automation } from "./entities/automation.entity";
import { ApiQuery, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import {JwtAuthGuard} from "../auth/jwt-auth.guard";


@ApiTags('Automations')
@Controller('automations')
export class AutomationController {
  constructor(private readonly automationService: AutomationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new automation' })
  @ApiResponse({ status: 201, description: 'Automation created successfully', type: Automation })
  @UseGuards(JwtAuthGuard)
  async create(@Body() createAutomationDto: CreateAutomationDto): Promise<Automation> {
    return this.automationService.create(createAutomationDto);
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
    return this.automationService.findAllPaginated(Number(page), Number(limit));
  }

  @Get("all")
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<Automation[]> {
    return this.automationService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an automation by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Get automation by ID', type: Automation })
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string): Promise<Automation> {
    return this.automationService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an automation' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Updated automation', type: Automation })
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateAutomationDto: UpdateAutomationDto): Promise<Automation> {
    return this.automationService.update(id, updateAutomationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an automation' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Automation deleted', type: Automation })
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string): Promise<Automation> {
    return this.automationService.remove(id);
  }
}
