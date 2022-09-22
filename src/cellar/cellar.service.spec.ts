import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CellarService } from './cellar.service';
import { Cellar } from './entities/cellar.entity';

describe('CellarService', () => {
  let service: CellarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CellarService,
        {
          provide: getRepositoryToken(Cellar),
          useValue: jest.fn(),
        },
      ],
    }).compile();

    service = module.get<CellarService>(CellarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
