import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCellarDto } from './dto/create-cellar.dto';
import { UpdateCellarDto } from './dto/update-cellar.dto';
import { Cellar } from './entities/cellar.entity';

@Injectable()
export class CellarService {
  constructor(
    @InjectRepository(Cellar)
    private cellarsRepository: Repository<Cellar>,
  ) {}
  create(owner: string, createCellarDto: CreateCellarDto) {
    return this.cellarsRepository.save({ owner, ...createCellarDto });
  }

  findAll(owner: string) {
    return this.cellarsRepository.find({ where: { owner } });
  }

  findOne(owner: string, id: string) {
    return this.cellarsRepository.findOneByOrFail({ owner, id });
  }

  async update(owner: string, id: string, updateCellarDto: UpdateCellarDto) {
    if (Object.keys(updateCellarDto).length === 0) {
      return;
    }
    const result = await this.cellarsRepository
      .createQueryBuilder()
      .update(updateCellarDto)
      .where({
        id,
        owner,
      })
      .execute();

    if (result.affected === 0) {
      throw new NotFoundException();
    }
    return result.raw[0];
  }

  async remove(owner: string, id: string) {
    const result = await this.cellarsRepository.delete({
      id,
      owner,
    });

    if (result.affected === 0) {
      throw new NotFoundException();
    }

    return;
  }
}
