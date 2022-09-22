import { PartialType } from '@nestjs/mapped-types';
import { CreateCellarDto } from './create-cellar.dto';

export class UpdateCellarDto extends PartialType(CreateCellarDto) {}
