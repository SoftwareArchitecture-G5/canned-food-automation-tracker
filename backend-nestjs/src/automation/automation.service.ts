import {Injectable, NotFoundException, Logger} from '@nestjs/common';
import { CreateAutomationDto } from './dto/create-automation.dto';
import { UpdateAutomationDto } from './dto/update-automation.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Automation} from "./entities/automation.entity";
import {Repository} from "typeorm";

@Injectable()
export class AutomationService {
  private readonly logger = new Logger(AutomationService.name);

  constructor(
      @InjectRepository(Automation)
      private readonly automationRepository: Repository<Automation>,
  ) {
    this.logger.log('AutomationService initialized');
  }

  async create(createAutomationDto: CreateAutomationDto) {
    this.logger.log(`Creating new automation with name: ${createAutomationDto.name}`);
    try {
      const result = await this.automationRepository.save(createAutomationDto);
      this.logger.log(`Automation created with ID: ${result.automation_id}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to create automation: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(): Promise<Automation[]> {
    this.logger.log('Finding all automations');
    try {
      const automations = await this.automationRepository.find();
      this.logger.log(`Found ${automations.length} automations`);
      return automations;
    } catch (error) {
      this.logger.error(`Failed to find all automations: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: string): Promise<Automation> {
    this.logger.log(`Finding automation with ID: ${id}`);
    try {
      const automation = await this.automationRepository.findOneBy({automation_id: id});
      
      if (!automation) {
        this.logger.warn(`Automation with ID ${id} not found`);
        throw new NotFoundException(`Automation with id ${id} not found`);
      }
      
      this.logger.log(`Found automation: ${automation.name} (ID: ${automation.automation_id})`);
      return automation;
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        this.logger.error(`Error finding automation with ID ${id}: ${error.message}`, error.stack);
      }
      throw error;
    }
  }

  async update(id: string, updateAutomationDto: UpdateAutomationDto): Promise<Automation> {
    this.logger.log(`Updating automation with ID: ${id}`);
    try {
      const automation = await this.findOne(id);
      this.logger.debug(`Found automation to update: ${automation.name}`);
      
      const updatedAutomation = Object.assign(automation, updateAutomationDto);
      const result = await this.automationRepository.save(updatedAutomation);
      
      this.logger.log(`Automation ${id} updated successfully`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to update automation ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: string): Promise<Automation> {
    this.logger.log(`Removing automation with ID: ${id}`);
    try {
      const automation = await this.findOne(id);
      this.logger.debug(`Found automation to remove: ${automation.name}`);
      
      const result = await this.automationRepository.remove(automation);
      this.logger.log(`Automation ${id} removed successfully`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to remove automation ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAllPaginated(page: number, limit: number): Promise<{ data: Automation[]; total: number }> {
    this.logger.log(`Finding paginated automations (page: ${page}, limit: ${limit})`);
    try {
      const skip = (page - 1) * limit;
    
      const [data, total] = await this.automationRepository.findAndCount({
        skip,
        take: limit,
        order: { created_at: 'DESC' },
      });
    
      this.logger.log(`Found ${data.length} automations (total: ${total})`);
      return { data, total };
    } catch (error) {
      this.logger.error(`Failed to find paginated automations: ${error.message}`, error.stack);
      throw error;
    }
  }
}