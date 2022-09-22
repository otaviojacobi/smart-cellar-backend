import { Test, TestingModule } from '@nestjs/testing';
import { CellarService } from './cellar.service';

describe('CellarService', () => {
  let service: CellarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CellarService],
    }).compile();

    service = module.get<CellarService>(CellarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
