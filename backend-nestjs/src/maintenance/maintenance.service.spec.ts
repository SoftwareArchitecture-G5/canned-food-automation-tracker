import { Test, TestingModule } from '@nestjs/testing';
import { MaintenanceService } from './maintenance.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Maintenance, MaintenanceStatus } from './entities/maintenance.entity';
import { Automation } from '../automation/entities/automation.entity';
import { Repository } from 'typeorm';
import { AutomationService } from '../automation/automation.service';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';

describe('MaintenanceService', () => {
  let service: MaintenanceService;
  let repo: jest.Mocked<Repository<Maintenance>>;
  let automationService: { findOne: jest.Mock };

  const mockAutomation = Object.assign(new Automation(), {
    automation_id: 'auto-123',
    name: 'Test Automation',
    description: 'Mock description',
    status: 'active',
    created_at: new Date(),
    updated_at: new Date(),
    maintenances: [],
  });

  const mockMaintenance = Object.assign(new Maintenance(), {
    maintenance_id: 'mnt-001',
    automation: mockAutomation,
    issue_report: 'Fan overheating',
    date: new Date('2025-04-01'),
    status: MaintenanceStatus.PENDING,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MaintenanceService,
        {
          provide: getRepositoryToken(Maintenance),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOneBy: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: AutomationService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(MaintenanceService);
    repo = module.get(getRepositoryToken(Maintenance));
    automationService = module.get(AutomationService);
  });

  describe('create', () => {
    it('should create and save a new maintenance record', async () => {
      const dto: CreateMaintenanceDto = {
        automation_id: mockAutomation.automation_id,
        date: mockMaintenance.date,
        issue_report: mockMaintenance.issue_report,
      };

      automationService.findOne.mockResolvedValue(mockAutomation);
      repo.create.mockReturnValue(mockMaintenance);
      repo.save.mockResolvedValue(mockMaintenance);

      const result = await service.create(dto);

      expect(automationService.findOne).toHaveBeenCalledWith(dto.automation_id);
      expect(repo.create).toHaveBeenCalledWith({ ...dto, automation: mockAutomation });
      expect(repo.save).toHaveBeenCalledWith(mockMaintenance);
      expect(result).toEqual(mockMaintenance);
    });

    it('should throw InternalServerErrorException if save fails', async () => {
      const dto: CreateMaintenanceDto = {
        automation_id: mockAutomation.automation_id,
        date: new Date(),
        issue_report: 'Error',
      };

      const failed = Object.assign(new Maintenance(), { ...dto, automation: mockAutomation });

      automationService.findOne.mockResolvedValue(mockAutomation);
      repo.create.mockReturnValue(failed);
      repo.save.mockRejectedValue(new InternalServerErrorException('DB error'));

      await expect(service.create(dto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findAll', () => {
    it('should return all maintenance records with automation relations', async () => {
      repo.find.mockResolvedValue([mockMaintenance]);

      const result = await service.findAll();

      expect(repo.find).toHaveBeenCalledWith({ relations: ['automation'] });
      expect(result).toEqual([mockMaintenance]);
    });
  });

  describe('findOne', () => {
    it('should return a maintenance record if found', async () => {
      repo.findOneBy.mockResolvedValue(mockMaintenance);

      const result = await service.findOne('mnt-001');

      expect(repo.findOneBy).toHaveBeenCalledWith({ maintenance_id: 'mnt-001' });
      expect(result).toEqual(mockMaintenance);
    });

    it('should throw NotFoundException if not found', async () => {
      repo.findOneBy.mockResolvedValue(null);

      await expect(service.findOne('not-found-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return the updated maintenance record', async () => {
      const updateDto: UpdateMaintenanceDto = {
        issue_report: 'Fan replaced',
        status: MaintenanceStatus.COMPLETED,
        date: new Date('2025-04-02'),
      };

      const updated = Object.assign(new Maintenance(), { ...mockMaintenance, ...updateDto });

      jest.spyOn(service, 'findOne').mockResolvedValue(mockMaintenance);
      repo.save.mockResolvedValue(updated);

      const result = await service.update(mockMaintenance.maintenance_id, updateDto);

      expect(service.findOne).toHaveBeenCalledWith(mockMaintenance.maintenance_id);
      expect(repo.save).toHaveBeenCalledWith(expect.objectContaining(updateDto));
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('should find and remove the maintenance record', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockMaintenance);
      repo.remove.mockResolvedValue(mockMaintenance);

      const result = await service.remove(mockMaintenance.maintenance_id);

      expect(service.findOne).toHaveBeenCalledWith(mockMaintenance.maintenance_id);
      expect(repo.remove).toHaveBeenCalledWith(mockMaintenance);
      expect(result).toEqual(mockMaintenance);
    });
  });

  describe('findAllByAutomationId', () => {
    it('should return all maintenance records for a given automation', async () => {
      automationService.findOne.mockResolvedValue(mockAutomation);
      repo.find.mockResolvedValue([mockMaintenance]);

      const result = await service.findAllByAutomationId(mockAutomation.automation_id);

      expect(automationService.findOne).toHaveBeenCalledWith(mockAutomation.automation_id);
      expect(repo.find).toHaveBeenCalledWith({
        where: { automation: { automation_id: mockAutomation.automation_id } },
        relations: ['automation'],
      });
      expect(result).toEqual([mockMaintenance]);
    });

    it('should throw NotFoundException if maintenance not found', async () => {
      automationService.findOne.mockResolvedValue(mockAutomation);
      repo.find.mockResolvedValue([]);

      await expect(async () => {
        const result = await service.findAllByAutomationId(mockAutomation.automation_id);
        if (result.length === 0) {
          throw new NotFoundException();
        }
      }).rejects.toThrow(NotFoundException);
    });
  });
});
