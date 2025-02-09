import {Module} from '@nestjs/common';
import {MaintenanceService} from './maintenance.service';
import {MaintenanceController} from './maintenance.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Maintenance} from "./entities/maintenance.entity";
import {AutomationService} from "../automation/automation.service";
import {Automation} from "../automation/entities/automation.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Maintenance, Automation])],
    controllers: [MaintenanceController],
    providers: [MaintenanceService, AutomationService],
})
export class MaintenanceModule {
}
