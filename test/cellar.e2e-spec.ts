import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Cellar Controller (e2e)', () => {
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

  describe('Create and get cellar', () => {
    it('/cellar (GET) - Should get unhautorized without token', () => {
      return request(app.getHttpServer())
        .get('/cellar')
        .expect(401)
        .expect({ statusCode: 401, message: 'Unauthorized' });
    });

    it('/cellar (GET) - Should get empty owned cellars', async () => {
      return request(app.getHttpServer())
        .get('/cellar')
        .set('Authorization', `Bearer ${tokenUser1}`)
        .expect(200)
        .expect([]);
    });

    it('/cellar (GET) - Should create one cellars', async () => {
      return request(app.getHttpServer())
        .post('/cellar')
        .set('Authorization', `Bearer ${tokenUser1}`)
        .send({
          name: 'my-test-cellar',
          capacity: 5,
        })
        .expect(201);
    });
  });
});
