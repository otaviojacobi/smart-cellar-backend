import { Injectable } from '@nestjs/common';
import { CreateCellarDto } from './dto/create-cellar.dto';
import { UpdateCellarDto } from './dto/update-cellar.dto';

@Injectable()
export class CellarService {
  create(createCellarDto: CreateCellarDto) {
    return 'This action adds a new cellar';
  }

  findAll() {
    return `This action returns all cellar`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cellar`;
  }

  update(id: number, updateCellarDto: UpdateCellarDto) {
    return `This action updates a #${id} cellar`;
  }

  remove(id: number) {
    return `This action removes a #${id} cellar`;
  }
}
