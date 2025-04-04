import { Test, TestingModule } from '@nestjs/testing';
import { AutomationService } from './automation.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Automation } from './entities/automation.entity';
import { NotFoundException } from '@nestjs/common';
import { AutomationStatus } from './entities/automation.entity';


function createMockAutomation(override: Partial<Automation> = {}): Automation {
  return {
    automation_id: 'mock-id',
    name: 'Mock Name',
    description: 'Mock Description',
    status: AutomationStatus.ACTIVE,
    created_at: new Date(),
    updated_at: new Date(),
    maintenances: [],
    ...override,
  };
}

describe('AutomationService', () => {
  let service: AutomationService;
  let repo: jest.Mocked<Repository<Automation>>;

  beforeEach(async () => {
    const mockRepo = {
      save: jest.fn(),
      find: jest.fn(),
      findOneBy: jest.fn(),
      remove: jest.fn(),
      findAndCount: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AutomationService,
        {
          provide: getRepositoryToken(Automation),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<AutomationService>(AutomationService);
    repo = module.get(getRepositoryToken(Automation));
  });

  describe('create', () => {
    it('should save and return the new automation', async () => {
      const dto = {
        name: 'Test Automation',
        description: 'Testing desc',
        status: AutomationStatus.ACTIVE,
      };

      const savedAutomation = createMockAutomation({ automation_id: 'abc123', ...dto });

      repo.save.mockResolvedValue(savedAutomation);

      const result = await service.create(dto as any);
      expect(repo.save).toHaveBeenCalledWith(dto);
      expect(result).toEqual(savedAutomation);
    });
  });

  describe('findAll', () => {
    it('should return all automations', async () => {
      const mockData = [createMockAutomation({ automation_id: 'a1' })];
      repo.find.mockResolvedValue(mockData);

      const result = await service.findAll();
      expect(repo.find).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });
  });

  describe('findOne', () => {
    it('should return the automation if found', async () => {
      const automation = createMockAutomation({ automation_id: 'a123' });
      repo.findOneBy.mockResolvedValue(automation);

      const result = await service.findOne('a123');
      expect(repo.findOneBy).toHaveBeenCalledWith({ automation_id: 'a123' });
      expect(result).toEqual(automation);
    });

    it('should throw NotFoundException if not found', async () => {
      repo.findOneBy.mockResolvedValue(null);

      await expect(service.findOne('missing-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return the automation', async () => {
      const id = 'abc123';
      const existing = createMockAutomation({ automation_id: id, name: 'Old Name' });
      const updateDto = {
        name: 'New Name',
        status: AutomationStatus.ACTIVE,
      };
      const updated = createMockAutomation({ ...existing, ...updateDto });

      jest.spyOn(service, 'findOne').mockResolvedValue(existing);
      repo.save.mockResolvedValue(updated);

      const result = await service.update(id, updateDto);
      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(repo.save).toHaveBeenCalledWith(updated);
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('should remove the automation and return it', async () => {
      const id = 'abc123';
      const automation = createMockAutomation({ automation_id: id });

      jest.spyOn(service, 'findOne').mockResolvedValue(automation);
      repo.remove.mockResolvedValue(automation);

      const result = await service.remove(id);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(repo.remove).toHaveBeenCalledWith(automation);
      expect(result).toEqual(automation);
    });
  });

  describe('findAllPaginated', () => {
    it('should return paginated automation data and total count', async () => {
      const page = 2;
      const limit = 5;
      const skip = (page - 1) * limit;
      const data = [createMockAutomation({ automation_id: 'p1' })];
      const total = 10;

      repo.findAndCount.mockResolvedValue([data, total]);

      const result = await service.findAllPaginated(page, limit);

      expect(repo.findAndCount).toHaveBeenCalledWith({
        skip,
        take: limit,
        order: { created_at: 'DESC' },
      });

      expect(result).toEqual({ data, total });
    });
  });
});
