import { Test, TestingModule } from '@nestjs/testing';
import { CellarController } from './cellar.controller';
import { CellarService } from './cellar.service';

describe('CellarController', () => {
  let controller: CellarController;

  const cellarServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CellarController],
      providers: [
        {
          provide: CellarService,
          useValue: cellarServiceMock,
        },
      ],
    }).compile();

    controller = module.get<CellarController>(CellarController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should succeed if service create succeeds', async () => {
    cellarServiceMock.create.mockResolvedValue('test');
    const result = await controller.create(
      { name: 'test', capacity: 3 },
      { user: { email: 'email@test.com' } },
    );
    expect(cellarServiceMock.create).toHaveBeenCalledTimes(1);
    expect(result).toBe('test');
    expect(cellarServiceMock.create.mock.calls[0][0]).toBe('email@test.com');
    expect(cellarServiceMock.create.mock.calls[0][1]).toStrictEqual({
      name: 'test',
      capacity: 3,
    });
  });

  it('should succeed if service findAll succeeds', async () => {
    cellarServiceMock.findAll.mockResolvedValue('test');
    const result = await controller.findAll({
      user: { email: 'email@test.com' },
    });
    expect(cellarServiceMock.findAll).toHaveBeenCalledTimes(1);
    expect(result).toBe('test');
    expect(cellarServiceMock.findAll.mock.calls[0][0]).toBe('email@test.com');
  });

  it('should succeed if service findOne succeeds', async () => {
    cellarServiceMock.findOne.mockResolvedValue('test');
    const result = await controller.findOne('uid', {
      user: { email: 'email@test.com' },
    });
    expect(cellarServiceMock.findOne).toHaveBeenCalledTimes(1);
    expect(result).toBe('test');
    expect(cellarServiceMock.findOne.mock.calls[0][0]).toBe('email@test.com');
    expect(cellarServiceMock.findOne.mock.calls[0][1]).toBe('uid');
  });

  it('should succeed if service update succeeds', async () => {
    cellarServiceMock.update.mockResolvedValue('test');
    const result = await controller.update(
      'uid',
      { name: 'test', capacity: 3 },
      {
        user: { email: 'email@test.com' },
      },
    );
    expect(cellarServiceMock.update).toHaveBeenCalledTimes(1);
    expect(result).toBe('test');
    expect(cellarServiceMock.update.mock.calls[0][0]).toBe('email@test.com');
    expect(cellarServiceMock.update.mock.calls[0][1]).toBe('uid');
    expect(cellarServiceMock.update.mock.calls[0][2]).toStrictEqual({
      name: 'test',
      capacity: 3,
    });
  });

  it('should succeed if service delete succeeds', async () => {
    cellarServiceMock.remove.mockResolvedValue('test');
    const result = await controller.remove('uid', {
      user: { email: 'email@test.com' },
    });
    expect(cellarServiceMock.remove).toHaveBeenCalledTimes(1);
    expect(result).toBe('test');
    expect(cellarServiceMock.remove.mock.calls[0][0]).toBe('email@test.com');
    expect(cellarServiceMock.remove.mock.calls[0][1]).toBe('uid');
  });
});
