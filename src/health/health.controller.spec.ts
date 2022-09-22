import {
  HttpHealthIndicator,
  TerminusModule,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TerminusModule],
      controllers: [HealthController],
      providers: [
        {
          provide: HttpHealthIndicator,
          useValue: {
            pingCheck: jest.fn().mockResolvedValue({ test: { status: 'up' } }),
          },
        },
        {
          provide: TypeOrmHealthIndicator,
          useValue: {
            pingCheck: jest.fn().mockResolvedValue({ db: { status: 'up' } }),
          },
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call http ping check', async () => {
    const result = await controller.check();
    expect(result).toStrictEqual({
      status: 'ok',
      info: { test: { status: 'up' } },
      error: {},
      details: { test: { status: 'up' } },
    });
  });

  it('should call db ping check', async () => {
    const result = await controller.checkDb();
    expect(result).toStrictEqual({
      status: 'ok',
      info: { db: { status: 'up' } },
      error: {},
      details: { db: { status: 'up' } },
    });
  });
});
