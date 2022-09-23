import { IsNotEmpty, IsString } from 'class-validator';

export class TokenResponse {
  @IsNotEmpty()
  @IsString()
  token: string;
}
