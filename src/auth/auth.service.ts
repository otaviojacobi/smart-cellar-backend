import { AuthConfig } from './auth.config';
import { Injectable } from '@nestjs/common';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import { AuthUserDto } from './dto/auth-user.dto';
import { AuthCodeDto } from './dto/auth-code.dto';

@Injectable()
export class AuthService {
  private userPool: CognitoUserPool;
  constructor(private readonly authConfig: AuthConfig) {
    this.userPool = new CognitoUserPool({
      UserPoolId: this.authConfig.userPoolId,
      ClientId: this.authConfig.clientId,
    });
  }

  confirmUser({ email, code }: AuthCodeDto) {
    const userData = {
      Username: email,
      Pool: this.userPool,
    };

    const newUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      return newUser.confirmRegistration(code, true, (err, result) => {
        if (!result) {
          reject(err);
        } else {
          resolve(result.user);
        }
      });
    });
  }

  registerUser({ email, password }: AuthUserDto) {
    return new Promise((resolve, reject) => {
      return this.userPool.signUp(email, password, [], null, (err, result) => {
        if (!result) {
          reject(err);
        } else {
          resolve(result.user);
        }
      });
    });
  }

  authenticateUser({ email, password }: AuthUserDto) {
    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    const userData = {
      Username: email,
      Pool: this.userPool,
    };

    const newUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      return newUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          resolve(result);
        },
        onFailure: (err) => {
          reject(err);
        },
        newPasswordRequired: () => {
          reject({ message: 'New password neded' });
        },
      });
    });
  }
}
