import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CellarModule } from './cellar/cellar.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: +process.env.DB_PORT || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PWD || 's3cretp4ss',
      database: process.env.DB_NAME || 'postgres',
      entities: [],
      logging: 'all',
      synchronize: true,
    }),
    HealthModule,
    CellarModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
