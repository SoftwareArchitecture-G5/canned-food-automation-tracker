import {Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import {CreateMaintenanceDto} from './dto/create-maintenance.dto';
import {UpdateMaintenanceDto} from './dto/update-maintenance.dto';
import {Maintenance} from "./entities/maintenance.entity";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {AutomationService} from "../automation/automation.service";

@Injectable()
export class MaintenanceService {
    constructor(
        @InjectRepository(Maintenance) private readonly maintenanceRepository: Repository<Maintenance>,
        private readonly automationService: AutomationService,
        ) {
    }

    async create(createMaintenanceDto: CreateMaintenanceDto): Promise<Maintenance> {
        const automation = await this.automationService.findOne(createMaintenanceDto.automation_id)
        try {
            const maintenance = this.maintenanceRepository.create({
                ...createMaintenanceDto,
                automation
            })
            return this.maintenanceRepository.save(maintenance)
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    async findAll() {
        return this.maintenanceRepository.find({
            relations: ['automation'],
        })
    }

    async findOne(id: string): Promise<Maintenance> {
        const maintenance = await this.maintenanceRepository.findOneBy({maintenance_id: id});
        if (!maintenance) {
            throw new NotFoundException(`Could not find maintenance with id ${id}`);
        }
        return maintenance;
    }

    async update(id: string, updateMaintenanceDto: UpdateMaintenanceDto): Promise<Maintenance> {
        const maintenance = await this.findOne(id)
        Object.assign(maintenance, updateMaintenanceDto)
        return this.maintenanceRepository.save(maintenance)
    }

    async remove(id: string): Promise<Maintenance> {
        const maintenance = await this.findOne(id)
        return this.maintenanceRepository.remove(maintenance)
    }

    async findAllByAutomationId(automation_id: string, page: number, limit: number): Promise<Maintenance[]> {
        const automation = await this.automationService.findOne(automation_id)
        const maintenance = await this.maintenanceRepository.find({
            where: {
                automation: {automation_id: automation.automation_id}
            },
            relations: ["automation"],
            order: { date: 'ASC' },
            take: limit,  // Limit the number of records (page size)
            skip: (page - 1) * limit,  // Skip the records based on the page
        })

        if (!maintenance) {
            throw new NotFoundException(`Could not find maintenance with automation id ${automation_id}`)
        }

        return maintenance
    }
}
