import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import { AuthConfig } from './auth.config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

export function getMockCognitoUser(username) {
  return {
    user: new CognitoUser({
      Username: username,
      Pool: new CognitoUserPool({
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        ClientId: process.env.COGNITO_CLIENT_ID,
      }),
    }),
    userConfirmed: true,
    userSub: 'test-sub',
    codeDeliveryDetails: undefined,
  };
}

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule,
        ConfigModule.forRoot({
          envFilePath: '.test.env',
        }),
      ],
      providers: [AuthConfig, AuthService, JwtStrategy],
      controllers: [AuthController],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Register user', () => {
    it('should register user when cognito auth succeeds', async () => {
      const testUser = 'my-test-user';

      const spy = jest.spyOn(CognitoUserPool.prototype, 'signUp');
      spy.mockImplementation((_e, _p, _a, _v, cb) =>
        cb(null, getMockCognitoUser(testUser)),
      );

      const result = await service.registerUser({
        email: testUser,
        password: 'p4ss',
      });
      expect(result.getUsername()).toBe(testUser);

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should fail to register user when cognito signup fails', async () => {
      const err = { name: 'err', message: 'err-msg' };

      const spy = jest.spyOn(CognitoUserPool.prototype, 'signUp');
      spy.mockImplementation((_e, _p, _a, _v, cb) => cb(err, null));

      expect(
        service.registerUser({
          email: 'test',
          password: 'p4ss',
        }),
      ).rejects.toEqual(err);

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Confirm user registration', () => {
    it('should confirm user when cognito auth succeeds', async () => {
      const testUser = 'my-test-user-confirmation';

      const spy = jest.spyOn(CognitoUser.prototype, 'confirmRegistration');
      spy.mockImplementation((_c, _f, cb) =>
        cb(null, getMockCognitoUser(testUser)),
      );

      const result = await service.confirmUser({
        email: testUser,
        code: 'p4ss',
      });
      expect(result.getUsername()).toBe(testUser);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should fail to conrim user when cognito confirm fails', async () => {
      const err = { name: 'err-code', message: 'err-msg-code' };

      const spy = jest.spyOn(CognitoUser.prototype, 'confirmRegistration');
      spy.mockImplementation((_c, _f, cb) => cb(err, null));

      expect(
        service.confirmUser({
          email: 'test',
          code: 'p4ss',
        }),
      ).rejects.toEqual(err);

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Authenticate user', () => {
    it('should login user when cognito auth succeeds', async () => {
      const testToken = 'my-test-token';

      const spy = jest.spyOn(CognitoUser.prototype, 'authenticateUser');
      spy.mockImplementation((_, { onSuccess }) =>
        onSuccess({
          getAccessToken: jest.fn(),
          getRefreshToken: jest.fn(),
          getIdToken: jest.fn().mockReturnValue({
            getJwtToken: jest.fn().mockReturnValue(testToken),
          }),
          isValid: jest.fn(),
        }),
      );

      const result = await service.authenticateUser({
        email: 'test',
        password: 'p4ss',
      });
      expect(result.token).toBe(testToken);

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should fail to login if cognito fails to authorize', async () => {
      const failMessage = 'failure-message';

      const spy = jest.spyOn(CognitoUser.prototype, 'authenticateUser');
      spy.mockImplementation((_, { onFailure }) =>
        onFailure({ message: failMessage }),
      );

      expect(
        service.authenticateUser({
          email: 'test',
          password: 'p4ss',
        }),
      ).rejects.toEqual({ message: failMessage });

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should fail to login if cognito requires password change', async () => {
      const spy = jest.spyOn(CognitoUser.prototype, 'authenticateUser');
      spy.mockImplementation((_, { newPasswordRequired }) =>
        newPasswordRequired('a', 'b'),
      );

      expect(
        service.authenticateUser({
          email: 'test',
          password: 'p4ss',
        }),
      ).rejects.toEqual({ message: 'New password needed' });

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
