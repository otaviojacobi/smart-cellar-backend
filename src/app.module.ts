import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CellarModule } from './cellar/cellar.module';

const getDBModule = () => {
  if (process.env.NODE_ENV === 'test') {
    return TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      synchronize: true,
      autoLoadEntities: true,
    });
  }
  return TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: +process.env.DB_PORT || 5432,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PWD || 's3cretp4ss',
    database: process.env.DB_NAME || 'postgres',
    autoLoadEntities: true,
    synchronize: true,
  });
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    getDBModule(),
    HealthModule,
    CellarModule,
    AuthModule,
  ],
})
export class AppModule {}
