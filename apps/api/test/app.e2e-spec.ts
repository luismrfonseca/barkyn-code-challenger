import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/courses (GET) - should return 401 without x-user-id header', () => {
    return request(app.getHttpServer())
      .get('/courses')
      .expect(401);
  });

  it('/courses (GET) - should return 200 with x-user-id header', () => {
    return request(app.getHttpServer())
      .get('/courses')
      .set('x-user-id', 'test-user-id')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });

  it('/enroll (POST) - should return 401 without valid userId', () => {
    return request(app.getHttpServer())
      .post('/enroll')
      .send({ userId: 'invalid-user', courseId: 'invalid-course' })
      .expect(401);
  });

  it('/profile/:id (GET) - should return 200', () => {
    return request(app.getHttpServer())
      .get('/profile/non-existent-id')
      .expect(200);
  });

  it('/user/:id (GET) - should return 200', () => {
    return request(app.getHttpServer())
      .get('/user/non-existent-id')
      .expect(200);
  });

  it('/user (GET) - should return 200 with array', () => {
    return request(app.getHttpServer())
      .get('/user')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });

  it('/courses/complete (PATCH) - should return 401 without valid userId', () => {
    return request(app.getHttpServer())
      .patch('/courses/complete')
      .send({ userId: 'invalid-user', courseId: 'invalid-course' })
      .expect(401);
  });

  afterAll(async () => {
    await app.close();
  });
});
