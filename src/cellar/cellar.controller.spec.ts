import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CellarController } from './cellar.controller';
import { CellarService } from './cellar.service';
import { Cellar } from './entities/cellar.entity';

describe('CellarController', () => {
  let controller: CellarController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CellarController],
      providers: [
        CellarService,
        {
          provide: getRepositoryToken(Cellar),
          useValue: jest.fn(),
        },
      ],
    }).compile();

    controller = module.get<CellarController>(CellarController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
