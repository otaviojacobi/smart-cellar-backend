import { Module } from '@nestjs/common';
import { AuthConfig } from './auth.config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [PassportModule],
  providers: [AuthConfig, AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
