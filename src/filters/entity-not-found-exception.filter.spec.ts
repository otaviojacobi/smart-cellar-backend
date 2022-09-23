import { Test, TestingModule } from '@nestjs/testing';
import { Cellar } from '../cellar/entities/cellar.entity';
import { EntityNotFoundError } from 'typeorm';
import { EntityNotFoundExceptionFilter } from './entity-not-found-exception.filter';

describe('entity not found test', () => {
  let service: EntityNotFoundExceptionFilter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EntityNotFoundExceptionFilter],
    }).compile();
    service = module.get<EntityNotFoundExceptionFilter>(
      EntityNotFoundExceptionFilter,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return 404 when matched', () => {
    const responseMock = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    const ctxMock = {
      getResponse: jest.fn().mockReturnValue(responseMock),
    };
    const hostMock = {
      switchToHttp: jest.fn().mockReturnValue(ctxMock),
      getArgByIndex: jest.fn(),
      getArgs: jest.fn(),
      getType: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
    };

    const output = service.catch(
      new EntityNotFoundError(Cellar, 'test'),
      hostMock,
    );

    expect(responseMock.status.mock.calls[0][0]).toStrictEqual(404);
    expect(responseMock.json.mock.calls[0][0]).toStrictEqual({
      message: {
        statusCode: 404,
        error: 'Not Found',
      },
    });
    expect(hostMock.switchToHttp).toHaveBeenCalledTimes(1);
    expect(ctxMock.getResponse).toHaveBeenCalledTimes(1);

    expect(output).toBe(responseMock);
  });
});
