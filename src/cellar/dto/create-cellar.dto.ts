import { IsInt, IsNotEmpty, Min, MinLength } from 'class-validator';

export class CreateCellarDto {
  @IsNotEmpty()
  @MinLength(4)
  name: string;

  @IsInt()
  @Min(0)
  capacity: number;
}
