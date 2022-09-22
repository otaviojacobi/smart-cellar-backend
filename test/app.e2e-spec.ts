import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let tokenUser1: string;
  let tokenUser2: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    const server = app.getHttpServer();

    let response = await request(server).post('/auth/login').send({
      email: 'test_user_1@gmail.com',
      password: 'Mys3cret',
    });
    tokenUser1 = response.body.token;

    response = await request(server).post('/auth/login').send({
      email: 'test_user_2@gmail.com',
      password: 'Mys3cret',
    });
    tokenUser2 = response.body.token;
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('health checks', () => {
    it('/ (GET)', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Hello test');
    });

    it('/health (GET)', () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect({
          status: 'ok',
          info: { google: { status: 'up' } },
          error: {},
          details: { google: { status: 'up' } },
        });
    });

    it('/health/db (GET)', () => {
      return request(app.getHttpServer())
        .get('/health/db')
        .expect(200)
        .expect({
          status: 'ok',
          info: { database: { status: 'up' } },
          error: {},
          details: { database: { status: 'up' } },
        });
    });
  });

  describe('cellar', () => {
    it('/cellar (GET) - Should get unhautorized without token', () => {
      return request(app.getHttpServer())
        .get('/cellar')
        .expect(401)
        .expect({ statusCode: 401, message: 'Unauthorized' });
    });

    it('/cellar (GET) - Should get owned cellars', async () => {
      return request(app.getHttpServer())
        .get('/cellar')
        .set('Authorization', `Bearer ${tokenUser1}`)
        .expect(200)
        .expect('This action returns all cellar');
    });
  });
});
