import {Injectable, NotFoundException} from '@nestjs/common';
import { CreateAutomationDto } from './dto/create-automation.dto';
import { UpdateAutomationDto } from './dto/update-automation.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Automation} from "./entities/automation.entity";
import {Repository} from "typeorm";

@Injectable()
export class AutomationService {
  constructor(
      @InjectRepository(Automation)
      private readonly automationRepository: Repository<Automation>,
  ) {}

  create(createAutomationDto: CreateAutomationDto) {
    return this.automationRepository.save(createAutomationDto);
  }

  async findAll(): Promise<Automation[]> {
    return this.automationRepository.find();
  }

  async findOne(id: string): Promise<Automation> {
    const automation = await this.automationRepository.findOneBy({automation_id: id})
    if (!automation) {
      throw new NotFoundException(`Automation with id ${id} not found`);
    }
    return automation;
  }

  async update(id: string, updateAutomationDto: UpdateAutomationDto): Promise<Automation> {
    const automation = await this.findOne(id);
    const updatedAutomation = Object.assign(automation, updateAutomationDto);
    return this.automationRepository.save(updatedAutomation);
  }

  async remove(id: string): Promise<Automation> {
    const automation = await this.findOne(id);
    return this.automationRepository.remove(automation)

  }

  async findAllPaginated(page: number, limit: number): Promise<{ data: Automation[]; total: number }> {
    const skip = (page - 1) * limit;
  
    const [data, total] = await this.automationRepository.findAndCount({
      skip,
      take: limit,
      order: { created_at: 'DESC' },
    });
  
    return { data, total };
  }
  
}
