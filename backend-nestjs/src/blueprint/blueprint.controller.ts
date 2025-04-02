import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards} from '@nestjs/common';
import { BlueprintService } from './blueprint.service';
import { CreateBlueprintDto } from './dto/create-blueprint.dto';
import { UpdateBlueprintDto } from './dto/update-blueprint.dto';
import {Blueprint} from "./entities/blueprint.entity";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";

@Controller('blueprint')
export class BlueprintController {
  constructor(private readonly blueprintService: BlueprintService) {}

  @Post('/save')
  async create(@Body() createBlueprintDto: CreateBlueprintDto): Promise<Blueprint> {
    return this.blueprintService.create(createBlueprintDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.blueprintService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blueprintService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlueprintDto: UpdateBlueprintDto) {
    return this.blueprintService.update(id, updateBlueprintDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blueprintService.remove(id);
  }
}
