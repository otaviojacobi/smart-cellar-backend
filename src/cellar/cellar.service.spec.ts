import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CellarService } from './cellar.service';
import { Cellar } from './entities/cellar.entity';

describe('CellarService', () => {
  let service: CellarService;

  const repoMock = {
    save: jest.fn(),
    find: jest.fn(),
    findOneByOrFail: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    returning: jest.fn().mockReturnThis(),
    execute: jest.fn().mockReturnThis(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CellarService,
        {
          provide: getRepositoryToken(Cellar),
          useValue: repoMock,
        },
      ],
    }).compile();

    service = module.get<CellarService>(CellarService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should save cellar to DB', () => {
    service.create('the-owner', { name: 'test', capacity: 3 });
    expect(repoMock.save).toBeCalledTimes(1);
    expect(repoMock.save.mock.calls[0][0]).toStrictEqual({
      owner: 'the-owner',
      name: 'test',
      capacity: 3,
    });
  });

  it('should call DB repository find', () => {
    service.findAll('the-owner');
    expect(repoMock.find).toBeCalledTimes(1);
    expect(repoMock.find.mock.calls[0][0]).toStrictEqual({
      where: {
        owner: 'the-owner',
      },
    });
  });

  it('should call DB repository find one or fail', () => {
    service.findOne('the-owner', 'the-id');
    expect(repoMock.findOneByOrFail).toBeCalledTimes(1);
    expect(repoMock.findOneByOrFail.mock.calls[0][0]).toStrictEqual({
      id: 'the-id',
      owner: 'the-owner',
    });
  });

  it('should throw if updates with no change in db', () => {
    repoMock.execute.mockResolvedValue({ affected: 0 });

    expect(
      service.update('the-owner', 'the-id', { name: 'test' }),
    ).rejects.toThrowError(NotFoundException);

    expect(repoMock.update.mock.calls[0][0]).toStrictEqual({
      name: 'test',
    });

    expect(repoMock.where.mock.calls[0][0]).toStrictEqual({
      owner: 'the-owner',
      id: 'the-id',
    });

    expect(repoMock.returning.mock.calls[0][0]).toBe('*');
  });

  it('should return entity if updates with rows affected', async () => {
    repoMock.execute.mockResolvedValue({
      affected: 1,
      raw: [{ name: 'test-2' }],
    });

    const out = await service.update('the-owner', 'the-id', { name: 'test-2' });
    expect(out).toStrictEqual({ name: 'test-2' });

    expect(repoMock.update.mock.calls[0][0]).toStrictEqual({
      name: 'test-2',
    });

    expect(repoMock.where.mock.calls[0][0]).toStrictEqual({
      owner: 'the-owner',
      id: 'the-id',
    });

    expect(repoMock.returning.mock.calls[0][0]).toBe('*');
  });

  it('should throw if deletes with no change in db', () => {
    repoMock.delete.mockResolvedValue({ affected: 0 });

    expect(service.remove('the-owner', 'the-id')).rejects.toThrowError(
      NotFoundException,
    );

    expect(repoMock.delete.mock.calls[0][0]).toStrictEqual({
      owner: 'the-owner',
      id: 'the-id',
    });
  });

  it('should return entity if rows affected', async () => {
    repoMock.delete.mockResolvedValue({ affected: 1 });

    await service.remove('the-owner', 'the-id');

    expect(repoMock.delete.mock.calls[0][0]).toStrictEqual({
      owner: 'the-owner',
      id: 'the-id',
    });
  });
});
