import app from '../../app';
import request from 'supertest';
import { signin } from './test-utils';
import db from '../../database/sql';
import { category, subCategory } from '../../models/schema';
import { eq } from 'drizzle-orm';

describe('Category route', () => {
  let categoryId: number;
  beforeAll(async () => {
    await db.insert(category).values({ name: 'test', description: 'test' });
    const result = await db
      .select()
      .from(category)
      .where(eq(category.name, 'test'));
    categoryId = result[0].id;
  });
  beforeEach(async () => {
    await db.delete(subCategory);
  });
  afterAll(async () => {
    await db.delete(category);
    await db.delete(subCategory);
  });
  it('should return 400 if category name is already exist', async () => {
    const accessToken = signin();
    const response = await request(app)
      .post('/product/category')
      .set('Cookie', [`accessToken=${accessToken}`])
      .send({
        name: 'test',
        description: 'test',
        categoryId,
      });
    const response2 = await request(app)
      .post('/product/category')
      .set('Cookie', [`accessToken=${accessToken}`])
      .send({
        name: 'test',
        description: 'test',
        categoryId,
      });
    expect(response.status).toBe(200);
    expect(response2.status).toBe(400);
  });

  it('should return 401 if user is not admin', async () => {
    const response = await request(app).post('/product/category').send({
      name: 'test',
      description: 'test',
      categoryId,
    });
    expect(response.status).toBe(401);
  });

  it('should update category', async () => {
    const accessToken = signin();
    const response = await request(app)
      .post('/product/category')
      .set('Cookie', [`accessToken=${accessToken}`])
      .send({
        name: 'test',
        description: 'test',
        categoryId,
      });
    const response2 = await request(app)
      .patch(`/product/category/${response.body.category.id}`)
      .set('Cookie', [`accessToken=${accessToken}`])
      .send({
        name: 'test2',
        description: 'test2',
        categoryId,
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
        categoryId,
      });
    const response2 = await request(app)
      .delete(`/product/category/${response.body.category.id}`)
      .set('Cookie', [`accessToken=${accessToken}`]);
    expect(response2.status).toBe(204);
  });
});
