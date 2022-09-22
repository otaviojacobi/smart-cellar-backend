import { Module } from '@nestjs/common';
import { CellarService } from './cellar.service';
import { CellarController } from './cellar.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [CellarController],
  providers: [CellarService],
})
export class CellarModule {}
