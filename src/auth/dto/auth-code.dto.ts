import { IsEmail, IsNotEmpty, IsNumberString } from 'class-validator';

export class AuthCodeDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNumberString()
  @IsNotEmpty()
  code: string;
}
