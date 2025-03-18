import { Module } from '@nestjs/common';
import { BlueprintService } from './blueprint.service';
import { BlueprintController } from './blueprint.controller';
import {Blueprint} from "./entities/blueprint.entity";
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([Blueprint])],
  controllers: [BlueprintController],
  providers: [BlueprintService],
})
export class BlueprintModule {}
