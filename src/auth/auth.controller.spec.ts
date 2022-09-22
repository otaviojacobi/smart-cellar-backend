import { BadRequestException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthConfig } from './auth.config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { getMockCognitoUser } from './auth.service.spec';
import { JwtStrategy } from './jwt.strategy';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule,
        ConfigModule.forRoot({
          envFilePath: '.env.test',
        }),
      ],
      providers: [AuthConfig, AuthService, JwtStrategy],
      controllers: [AuthController],
    }).compile();

    service = module.get<AuthService>(AuthService);
    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('Should succeed if auth service succeeds', async () => {
      const user = getMockCognitoUser('test').user;
      const spy = jest
        .spyOn(service, 'registerUser')
        .mockImplementation(() => Promise.resolve(user));

      const result = await controller.register({
        email: 'test',
        password: 'p4ss',
      });
      expect(result).toBe(user);

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('Should throw 400 if auth service fails', async () => {
      const spy = jest
        .spyOn(service, 'registerUser')
        .mockImplementation(() => Promise.reject({ message: 'failed' }));

      expect(
        controller.register({ email: 'test', password: 'p4ss' }),
      ).rejects.toEqual(new BadRequestException('failed'));

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('confirm', () => {
    it('Should succeed if auth service succeeds', async () => {
      const user = getMockCognitoUser('test').user;
      const spy = jest
        .spyOn(service, 'confirmUser')
        .mockImplementation(() => Promise.resolve(user));

      const result = await controller.confirm({
        email: 'test',
        code: 'p4ss',
      });
      expect(result).toBe(user);

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('Should throw 400 if auth service fails', async () => {
      const spy = jest
        .spyOn(service, 'confirmUser')
        .mockImplementation(() => Promise.reject({ message: 'failed' }));

      expect(
        controller.confirm({ email: 'test', code: 'p4ss' }),
      ).rejects.toEqual(new BadRequestException('failed'));

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('login', () => {
    it('Should succeed if auth service succeeds', async () => {
      const token = { token: 'test' };
      const spy = jest
        .spyOn(service, 'authenticateUser')
        .mockImplementation(() => Promise.resolve(token));

      const result = await controller.login({
        email: 'test',
        password: 'p4ss',
      });
      expect(result).toBe(token);

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('Should throw 400 if auth service fails', async () => {
      const spy = jest
        .spyOn(service, 'authenticateUser')
        .mockImplementation(() => Promise.reject({ message: 'failed' }));

      expect(
        controller.login({ email: 'test', password: 'p4ss' }),
      ).rejects.toEqual(new BadRequestException('failed'));

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
