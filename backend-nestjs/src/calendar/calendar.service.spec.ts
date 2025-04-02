import { Test, TestingModule } from '@nestjs/testing';
import { CalendarService } from './calendar.service';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { UpdateCalendarDto } from './dto/update-calendar.dto';

describe('CalendarService', () => {
  let service: CalendarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CalendarService],
    }).compile();

    service = module.get<CalendarService>(CalendarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should return create message', () => {
      const dto: CreateCalendarDto = {};
      const result = service.create(dto);
      expect(result).toBe('This action adds a new calendar');
    });
  });

  describe('findAll', () => {
    it('should return all calendar message', () => {
      expect(service.findAll()).toBe('This action returns all calendar');
    });
  });

  describe('findOne', () => {
    it('should return one calendar message', () => {
      const result = service.findOne(1);
      expect(result).toBe('This action returns a #1 calendar');
    });
  });

  describe('update', () => {
    it('should return update message', () => {
      const dto: UpdateCalendarDto = {};
      const result = service.update(1, dto);
      expect(result).toBe('This action updates a #1 calendar');
    });
  });

  describe('remove', () => {
    it('should return remove message', () => {
      const result = service.remove(1);
      expect(result).toBe('This action removes a #1 calendar');
    });
  });
});
