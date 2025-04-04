import {Injectable, InternalServerErrorException, NotFoundException, Logger} from '@nestjs/common';
import {CreateMaintenanceDto} from './dto/create-maintenance.dto';
import {UpdateMaintenanceDto} from './dto/update-maintenance.dto';
import {Maintenance} from "./entities/maintenance.entity";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {AutomationService} from "../automation/automation.service";
import { Between } from 'typeorm';


@Injectable()
export class MaintenanceService {
    private readonly logger = new Logger(MaintenanceService.name);

    constructor(
        @InjectRepository(Maintenance) private readonly maintenanceRepository: Repository<Maintenance>,
        private readonly automationService: AutomationService,
        ) {
        this.logger.log('MaintenanceService initialized');
    }

    async create(createMaintenanceDto: CreateMaintenanceDto): Promise<Maintenance> {
        this.logger.log(`Creating maintenance record for automation ID: ${createMaintenanceDto.automation_id}`);
        try {
            const automation = await this.automationService.findOne(createMaintenanceDto.automation_id);
            this.logger.debug(`Found automation: ${automation.automation_id}`);
            
            const maintenance = this.maintenanceRepository.create({
                ...createMaintenanceDto,
                automation
            });
            const result = await this.maintenanceRepository.save(maintenance);
            this.logger.log(`Maintenance record created with ID: ${result.maintenance_id}`);
            return result;
        } catch (error) {
            this.logger.error(`Failed to create maintenance record: ${error.message}`, error.stack);
            throw new InternalServerErrorException(error);
        }
    }

    async findAll() {
        this.logger.log('Finding all maintenance records');
        try {
            const records = await this.maintenanceRepository.find({
                relations: ['automation'],
            });
            this.logger.debug(`Found ${records.length} maintenance records`);
            return records;
        } catch (error) {
            this.logger.error(`Failed to find all maintenance records: ${error.message}`, error.stack);
            throw new InternalServerErrorException(error);
        }
    }

    async findOne(id: string): Promise<Maintenance> {
        this.logger.log(`Finding maintenance record with ID: ${id}`);
        try {
            const maintenance = await this.maintenanceRepository.findOneBy({maintenance_id: id});
            if (!maintenance) {
                this.logger.warn(`Maintenance record with ID ${id} not found`);
                throw new NotFoundException(`Could not find maintenance with id ${id}`);
            }
            this.logger.debug(`Found maintenance record: ${maintenance.maintenance_id}`);
            return maintenance;
        } catch (error) {
            if (!(error instanceof NotFoundException)) {
                this.logger.error(`Error finding maintenance record: ${error.message}`, error.stack);
            }
            throw error;
        }
    }

    async update(id: string, updateMaintenanceDto: UpdateMaintenanceDto): Promise<Maintenance> {
        this.logger.log(`Updating maintenance record with ID: ${id}`);
        try {
            const maintenance = await this.findOne(id);
            Object.assign(maintenance, updateMaintenanceDto);
            const result = await this.maintenanceRepository.save(maintenance);
            this.logger.log(`Maintenance record ${id} updated successfully`);
            return result;
        } catch (error) {
            this.logger.error(`Failed to update maintenance record ${id}: ${error.message}`, error.stack);
            throw error;
        }
    }

    async remove(id: string): Promise<Maintenance> {
        this.logger.log(`Removing maintenance record with ID: ${id}`);
        try {
            const maintenance = await this.findOne(id);
            const result = await this.maintenanceRepository.remove(maintenance);
            this.logger.log(`Maintenance record ${id} removed successfully`);
            return result;
        } catch (error) {
            this.logger.error(`Failed to remove maintenance record ${id}: ${error.message}`, error.stack);
            throw error;
        }
    }

    async findAllByAutomationId(automation_id: string, page: number, limit: number): Promise<Maintenance[]> {
        this.logger.log(`Finding maintenance records for automation ID: ${automation_id} (page: ${page}, limit: ${limit})`);
        try {
            const automation = await this.automationService.findOne(automation_id);
            this.logger.debug(`Found automation: ${automation.automation_id}`);
            
            const maintenance = await this.maintenanceRepository.find({
                where: {
                    automation: {automation_id: automation.automation_id}
                },
                relations: ["automation"],
                order: { date: 'ASC' },
                take: limit,
                skip: (page - 1) * limit,
            });

            if (!maintenance || maintenance.length === 0) {
                this.logger.warn(`No maintenance records found for automation ID ${automation_id}`);
                throw new NotFoundException(`Could not find maintenance with automation id ${automation_id}`);
            }
            
            this.logger.debug(`Found ${maintenance.length} maintenance records for automation ID ${automation_id}`);
            return maintenance;
        } catch (error) {
            this.logger.error(`Error finding maintenance records for automation ${automation_id}: ${error.message}`, error.stack);
            throw error;
        }
    }

    async findByDateRange(startDate: string, endDate: string): Promise<Maintenance[]> {
        this.logger.log(`Finding maintenance records between ${startDate} and ${endDate}`);
        try {
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
        
            this.logger.debug(`Searching with date range: ${start.toISOString()} to ${end.toISOString()}`);
            const maintenance = await this.maintenanceRepository.find({
                where: {
                    date: Between(start, end)
                },
                relations: ['automation'],
            });
            
            this.logger.debug(`Found ${maintenance?.length || 0} maintenance records in date range`);
            return maintenance || [];
        } catch (error) {
            this.logger.error(`Error in findByDateRange: ${error.message}`, error.stack);
            throw new Error(`Failed to find maintenance between ${startDate} and ${endDate}: ${error.message}`);
        }
    }
}