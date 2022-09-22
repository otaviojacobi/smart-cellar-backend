import { Module } from '@nestjs/common';
import { CellarService } from './cellar.service';
import { CellarController } from './cellar.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cellar } from './entities/cellar.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cellar]), AuthModule],
  controllers: [CellarController],
  providers: [CellarService],
})
export class CellarModule {}
