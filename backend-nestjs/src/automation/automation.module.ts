import { Module } from '@nestjs/common';
import { AutomationService } from './automation.service';
import { AutomationController } from './automation.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Automation} from "./entities/automation.entity";

@Module({
  imports: [TypeOrmModule.forFeature([
      Automation,
  ])],
  controllers: [AutomationController],
  providers: [AutomationService],
})
export class AutomationModule {}
