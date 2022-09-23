import { AuthConfig } from './auth.config';
import { Injectable } from '@nestjs/common';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import { AuthUserDto } from './dto/auth-user.dto';
import { AuthCodeDto } from './dto/auth-code.dto';
import { TokenResponse } from './dto/token-response.dto';

@Injectable()
export class AuthService {
  private userPool: CognitoUserPool;
  constructor(private readonly authConfig: AuthConfig) {
    this.userPool = new CognitoUserPool({
      UserPoolId: this.authConfig.userPoolId,
      ClientId: this.authConfig.clientId,
    });
  }

  registerUser({ email, password }: AuthUserDto): Promise<CognitoUser> {
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

  confirmUser({ email, code }: AuthCodeDto): Promise<CognitoUser> {
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

  authenticateUser({ email, password }: AuthUserDto): Promise<TokenResponse> {
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
          resolve({ token: result.getIdToken().getJwtToken() });
        },
        onFailure: (err) => {
          reject(err);
        },
        newPasswordRequired: () => {
          reject({ message: 'New password needed' });
        },
      });
    });
  }
}
