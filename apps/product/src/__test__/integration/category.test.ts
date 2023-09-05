import app from '../../app';
import request from 'supertest';
import { signin } from './test-utils';
import db from '../../database/sql';
import { category } from '../../models/schema';

describe('Category route', () => {
  beforeEach(async () => {
    await db.delete(category);
  });
  it('should return 400 if category name is already exist', async () => {
    const accessToken = signin();
    const response = await request(app)
      .post('/product/category')
      .set('Cookie', [`accessToken=${accessToken}`])
      .send({
        name: 'test',
        description: 'test',
      });
    const response2 = await request(app)
      .post('/product/category')
      .set('Cookie', [`accessToken=${accessToken}`])
      .send({
        name: 'test',
        description: 'test',
      });
    expect(response.status).toBe(200);
    expect(response2.status).toBe(400);
  });

  it('should return 401 if user is not admin', async () => {
    const response = await request(app).post('/product/category').send({
      name: 'test',
      description: 'test',
    });
    expect(response.status).toBe(401);
  });

  it('should return 404 if category is not exists', async () => {
    const accessToken = signin();
    const response = await request(app)
      .patch('/product/category/1')
      .set('Cookie', [`accessToken=${accessToken}`])
      .send({
        name: 'test',
        description: 'test',
      });
    expect(response.status).toBe(404);
  });

  it('should update category', async () => {
    const accessToken = signin();
    const response = await request(app)
      .post('/product/category')
      .set('Cookie', [`accessToken=${accessToken}`])
      .send({
        name: 'test',
        description: 'test',
      });
    const response2 = await request(app)
      .patch(`/product/category/${response.body.category.id}`)
      .set('Cookie', [`accessToken=${accessToken}`])
      .send({
        name: 'test2',
        description: 'test2',
      });
    expect(response2.status).toBe(204);
  });

  it('should delete category', async () => {
    const accessToken = signin();
    const response = await request(app)
      .post('/product/category')
      .set('Cookie', [`accessToken=${accessToken}`])
      .send({
        name: 'test',
        description: 'test',
      });
    const response2 = await request(app)
      .delete(`/product/category/${response.body.category.id}`)
      .set('Cookie', [`accessToken=${accessToken}`]);
    expect(response2.status).toBe(204);
  });

  it('should return 404 if category is not exists', async () => {
    const accessToken = signin();
    const response = await request(app)
      .delete('/product/category/1')
      .set('Cookie', [`accessToken=${accessToken}`]);
    expect(response.status).toBe(404);
  });
});
