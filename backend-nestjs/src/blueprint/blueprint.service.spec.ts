import { Test, TestingModule } from '@nestjs/testing';
import { BlueprintService } from './blueprint.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blueprint } from './entities/blueprint.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateBlueprintDto } from './dto/create-blueprint.dto';
import { UpdateBlueprintDto } from './dto/update-blueprint.dto';


const sampleNodes = [
  {
    id: 'node-1',
    data: { label: 'High CPU Usage Alert' },
    type: 'resizable',
    style: { width: 180, height: 80 },
    width: 180,
    height: 80,
    dragging: false,
    position: { x: 100, y: 100 },
    selected: false,
    positionAbsolute: { x: 100, y: 100 },
  },
];

const sampleEdges = [
  {
    id: 'edge-1',
    type: 'animated',
    source: 'node-1',
    target: 'node-2',
    animated: true,
    sourceHandle: 'node-1-bottom',
    targetHandle: 'node-2-top',
  },
];

function createMockBlueprint(override: Partial<Blueprint> = {}): Blueprint {
  return {
    blueprint_id: 'mock-id',
    name: 'Mock Blueprint',
    nodes: sampleNodes,
    edges: sampleEdges,
    created_at: new Date(),
    ...override,
  };
}

describe('BlueprintService', () => {
  let service: BlueprintService;
  let repo: jest.Mocked<Repository<Blueprint>>;

  beforeEach(async () => {
    const mockRepo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlueprintService,
        {
          provide: getRepositoryToken(Blueprint),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get(BlueprintService);
    repo = module.get(getRepositoryToken(Blueprint));
  });

  describe('create', () => {
    it('should create and save a new blueprint', async () => {
      const dto: CreateBlueprintDto = {
        name: 'Blueprint 1',
        nodes: sampleNodes,
        edges: sampleEdges,
      };

      const mockCreated = createMockBlueprint({ ...dto });
      const mockSaved = createMockBlueprint({ ...dto, blueprint_id: 'b1' });

      repo.create.mockReturnValue(mockCreated);
      repo.save.mockResolvedValue(mockSaved);

      const result = await service.create(dto);

      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(repo.save).toHaveBeenCalledWith(mockCreated);
      expect(result).toEqual(mockSaved);
    });
  });

  describe('findAll', () => {
    it('should return all blueprints', async () => {
      const mockData = [
        createMockBlueprint({ blueprint_id: 'b1' }),
        createMockBlueprint({ blueprint_id: 'b2' }),
      ];

      repo.find.mockResolvedValue(mockData);

      const result = await service.findAll();

      expect(repo.find).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });
  });

  describe('findOne', () => {
    it('should return a blueprint if found', async () => {
      const blueprint = createMockBlueprint({ blueprint_id: 'b1' });
      repo.findOne.mockResolvedValue(blueprint);

      const result = await service.findOne('b1');

      expect(repo.findOne).toHaveBeenCalledWith({ where: { blueprint_id: 'b1' } });
      expect(result).toEqual(blueprint);
    });

    it('should throw NotFoundException if blueprint is not found', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.findOne('not-found')).rejects.toThrow(NotFoundException);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { blueprint_id: 'not-found' } });
    });
  });

  describe('update', () => {
    it('should update and return the updated blueprint', async () => {
      const id = 'b1';
      const existing = createMockBlueprint({ blueprint_id: id });

      const updateDto: UpdateBlueprintDto = {
        name: 'Updated Blueprint',
        nodes: sampleNodes,
        edges: sampleEdges,
      };

      const merged = { ...existing, ...updateDto };

      jest.spyOn(service, 'findOne').mockResolvedValue(existing);
      repo.save.mockResolvedValue(merged);

      const result = await service.update(id, updateDto);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(repo.save).toHaveBeenCalledWith(expect.objectContaining(updateDto));
      expect(result).toEqual(merged);
    });
  });

  describe('remove', () => {
    it('should find and remove the blueprint', async () => {
      const id = 'b1';
      const blueprint = createMockBlueprint({ blueprint_id: id });

      jest.spyOn(service, 'findOne').mockResolvedValue(blueprint);
      repo.remove.mockResolvedValue(blueprint);

      const result = await service.remove(id);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(repo.remove).toHaveBeenCalledWith(blueprint);
      expect(result).toEqual(blueprint);
    });
  });
});
