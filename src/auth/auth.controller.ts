import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCodeDto } from './dto/auth-code.dto';
import { AuthUserDto } from './dto/auth-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerUserRequest: AuthUserDto) {
    try {
      return await this.authService.registerUser(registerUserRequest);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Post('confirm')
  async confirm(@Body() authCodeRequest: AuthCodeDto) {
    try {
      return await this.authService.confirmUser(authCodeRequest);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Post('login')
  async login(@Body() authenticateRequest: AuthUserDto) {
    try {
      return await this.authService.authenticateUser(authenticateRequest);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
