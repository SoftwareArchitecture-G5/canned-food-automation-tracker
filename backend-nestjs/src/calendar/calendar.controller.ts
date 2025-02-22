import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { UpdateCalendarDto } from './dto/update-calendar.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('Calendar')
@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new calendar' })
  @ApiResponse({ status: 201, description: 'Calendar created successfully' })
  create(@Body() createCalendarDto: CreateCalendarDto) {
    return this.calendarService.create(createCalendarDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all calendars' })
  @ApiResponse({ status: 200, description: 'List of calendars' })
  findAll() {
    return this.calendarService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a calendar by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Calendar details' })
  @ApiResponse({ status: 404, description: 'Calendar not found' })
  findOne(@Param('id') id: string) {
    return this.calendarService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a calendar' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Updated calendar' })
  update(@Param('id') id: string, @Body() updateCalendarDto: UpdateCalendarDto) {
    return this.calendarService.update(+id, updateCalendarDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a calendar' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Calendar deleted' })
  remove(@Param('id') id: string) {
    return this.calendarService.remove(+id);
  }
}
