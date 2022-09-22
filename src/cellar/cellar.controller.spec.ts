import { Test, TestingModule } from '@nestjs/testing';
import { CellarController } from './cellar.controller';
import { CellarService } from './cellar.service';

describe('CellarController', () => {
  let controller: CellarController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CellarController],
      providers: [CellarService],
    }).compile();

    controller = module.get<CellarController>(CellarController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
