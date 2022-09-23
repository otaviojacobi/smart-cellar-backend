import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { applyNestMiddlewares } from '../src/main';

describe('Cellar Controller (e2e)', () => {
  let app: INestApplication;
  let tokenUser1: string;
  let tokenUser2: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app = applyNestMiddlewares(app);
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

  describe('Cellar CRUD happy path', () => {
    it('/cellar (GET) - Should get empty owned cellars', async () => {
      return request(app.getHttpServer())
        .get('/cellar')
        .set('Authorization', `Bearer ${tokenUser1}`)
        .expect(200)
        .expect([]);
    });

    it('/cellar (POST) - Should create one cellar', async () => {
      await request(app.getHttpServer())
        .post('/cellar')
        .set('Authorization', `Bearer ${tokenUser1}`)
        .send({
          name: 'my-test-cellar',
          capacity: 5,
        })
        .expect(201);
    });

    it('/cellar (POST) - Should create another cellar', async () => {
      await request(app.getHttpServer())
        .post('/cellar')
        .set('Authorization', `Bearer ${tokenUser1}`)
        .send({
          name: 'my-test-cellar-2',
          capacity: 10,
        })
        .expect(201);
    });

    it('/cellar (GET) - Should be able to get created cellars', async () => {
      const result = await request(app.getHttpServer())
        .get('/cellar')
        .set('Authorization', `Bearer ${tokenUser1}`)
        .expect(200);

      expect(result.body.length).toBe(2);
    });

    it('/cellar/:id (GET) - Should be able to get single cellar', async () => {
      const result = await request(app.getHttpServer())
        .get('/cellar')
        .set('Authorization', `Bearer ${tokenUser1}`)
        .expect(200);

      const id = result.body[0].id;
      const single = await request(app.getHttpServer())
        .get(`/cellar/${id}`)
        .set('Authorization', `Bearer ${tokenUser1}`)
        .expect(200);

      expect(single.body).toStrictEqual(result.body[0]);
    });

    it('/cellar/:id (GET) - Should be able to update cellar', async () => {
      const result = await request(app.getHttpServer())
        .get('/cellar')
        .set('Authorization', `Bearer ${tokenUser1}`)
        .expect(200);

      const id = result.body[0].id;
      await request(app.getHttpServer())
        .patch(`/cellar/${id}`)
        .send({ name: 'updated-cellar-name' })
        .set('Authorization', `Bearer ${tokenUser1}`)
        .expect(200);

      const single = await request(app.getHttpServer())
        .get(`/cellar/${id}`)
        .set('Authorization', `Bearer ${tokenUser1}`)
        .expect(200);

      expect(single.body.name).toBe('updated-cellar-name');
    });

    it('/cellar/:id (DELETE) - Should be able to delete cellar', async () => {
      const result = await request(app.getHttpServer())
        .get('/cellar')
        .set('Authorization', `Bearer ${tokenUser1}`)
        .expect(200);

      const id = result.body[0].id;
      await request(app.getHttpServer())
        .delete(`/cellar/${id}`)
        .set('Authorization', `Bearer ${tokenUser1}`)
        .expect(204);

      await request(app.getHttpServer())
        .get(`/cellar/${id}`)
        .set('Authorization', `Bearer ${tokenUser1}`)
        .expect(404);
    });
  });

  describe('Should get unhautorized without token', () => {
    it('/cellar (GET) - Unhautorized GET', () => {
      return request(app.getHttpServer())
        .get('/cellar')
        .expect(401)
        .expect({ statusCode: 401, message: 'Unauthorized' });
    });

    it('/cellar/:id (GET) - Unhautorized GET by id', () => {
      return request(app.getHttpServer())
        .get('/cellar/f0c11d14-9362-47c8-bd2a-6fe32c54a47e')
        .expect(401)
        .expect({ statusCode: 401, message: 'Unauthorized' });
    });

    it('/cellar (POST) - Unhautorized create', () => {
      return request(app.getHttpServer())
        .post('/cellar')
        .send({ name: 'test', capacity: 3 })
        .expect(401)
        .expect({ statusCode: 401, message: 'Unauthorized' });
    });

    it('/cellar (PATCH) - Unhautorized update', () => {
      return request(app.getHttpServer())
        .patch(`/cellar/f0c11d14-9362-47c8-bd2a-6fe32c54a47e`)
        .send({ name: 'test', capacity: 3 })
        .expect(401)
        .expect({ statusCode: 401, message: 'Unauthorized' });
    });

    it('/cellar (DELETE) - Unhautorized delete', () => {
      return request(app.getHttpServer())
        .delete('/cellar/f0c11d14-9362-47c8-bd2a-6fe32c54a47e')
        .expect(401)
        .expect({ statusCode: 401, message: 'Unauthorized' });
    });
  });

  describe('Validation for body request types', () => {
    it('/cellar (POST) - Should not accept missing properties on creation', () => {
      return request(app.getHttpServer())
        .post('/cellar')
        .set('Authorization', `Bearer ${tokenUser1}`)
        .send({ name: 'test' })
        .expect(400)
        .expect({
          statusCode: 400,
          message: [
            'capacity must not be less than 0',
            'capacity must be an integer number',
          ],
          error: 'Bad Request',
        });
    });

    it('/cellar (POST) - Should not accept not numeric capacities', () => {
      return request(app.getHttpServer())
        .post('/cellar')
        .set('Authorization', `Bearer ${tokenUser1}`)
        .send({ name: 'test', capacity: '5' })
        .expect(400)
        .expect({
          statusCode: 400,
          message: [
            'capacity must not be less than 0',
            'capacity must be an integer number',
          ],
          error: 'Bad Request',
        });
    });

    it('/cellar (POST) - Should not accept not empty string name', () => {
      return request(app.getHttpServer())
        .post('/cellar')
        .set('Authorization', `Bearer ${tokenUser1}`)
        .send({ name: '', capacity: 5 })
        .expect(400)
        .expect({
          statusCode: 400,
          message: [
            'name must be longer than or equal to 4 characters',
            'name should not be empty',
          ],
          error: 'Bad Request',
        });
    });
  });

  describe('Cellar different users interactions', () => {
    it('Second user should not be able to get cellar from first', async () => {
      const result = await request(app.getHttpServer())
        .get('/cellar')
        .set('Authorization', `Bearer ${tokenUser1}`)
        .expect(200);

      const id = result.body[0].id;
      await request(app.getHttpServer())
        .get(`/cellar/${id}`)
        .set('Authorization', `Bearer ${tokenUser1}`)
        .expect(200);

      await request(app.getHttpServer())
        .get(`/cellar/${id}`)
        .set('Authorization', `Bearer ${tokenUser2}`)
        .expect(404);
    });

    it('Should not be able to update cellar owner', async () => {
      const result = await request(app.getHttpServer())
        .get('/cellar')
        .set('Authorization', `Bearer ${tokenUser1}`)
        .expect(200);

      const id = result.body[0].id;
      await request(app.getHttpServer())
        .patch(`/cellar/${id}`)
        .send({ owner: 'another-owner' })
        .set('Authorization', `Bearer ${tokenUser1}`)
        .expect(200);

      const single = await request(app.getHttpServer())
        .get(`/cellar/${id}`)
        .set('Authorization', `Bearer ${tokenUser1}`)
        .expect(200);

      expect(single.body.owner).toBe(result.body[0].owner);
    });

    it('Should not be able to update cellar owner but change other field', async () => {
      const result = await request(app.getHttpServer())
        .get('/cellar')
        .set('Authorization', `Bearer ${tokenUser1}`)
        .expect(200);

      const id = result.body[0].id;
      await request(app.getHttpServer())
        .patch(`/cellar/${id}`)
        .send({ owner: 'another-owner', name: 'another-name-test' })
        .set('Authorization', `Bearer ${tokenUser1}`)
        .expect(200);

      const single = await request(app.getHttpServer())
        .get(`/cellar/${id}`)
        .set('Authorization', `Bearer ${tokenUser1}`)
        .expect(200);

      expect(single.body.owner).toBe(result.body[0].owner);
      expect(single.body.name).toBe('another-name-test');
    });

    it('Should get 404 on getting other users cellar', async () => {
      const result = await request(app.getHttpServer())
        .get('/cellar')
        .set('Authorization', `Bearer ${tokenUser1}`)
        .expect(200);

      const id = result.body[0].id;
      await request(app.getHttpServer())
        .get(`/cellar/${id}`)
        .set('Authorization', `Bearer ${tokenUser2}`)
        .expect(404);
    });

    it('Should get 404 on updating other users cellar', async () => {
      const result = await request(app.getHttpServer())
        .get('/cellar')
        .set('Authorization', `Bearer ${tokenUser1}`)
        .expect(200);

      const id = result.body[0].id;
      await request(app.getHttpServer())
        .patch(`/cellar/${id}`)
        .send({ name: 'test-2' })
        .set('Authorization', `Bearer ${tokenUser2}`)
        .expect(404);
    });

    it('Should get 404 on deleting other users cellar', async () => {
      const result = await request(app.getHttpServer())
        .get('/cellar')
        .set('Authorization', `Bearer ${tokenUser1}`)
        .expect(200);

      const id = result.body[0].id;
      await request(app.getHttpServer())
        .delete(`/cellar/${id}`)
        .set('Authorization', `Bearer ${tokenUser2}`)
        .expect(404);
    });
  });
});
