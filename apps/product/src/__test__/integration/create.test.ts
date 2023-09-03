import app from '../../app';
import request from 'supertest';
import { signin } from './test-utils';

describe('Create product route', () => {
  const validData = {
    name: 'test',
    description: 'test',
    stock: '10',
    price: '10.6',
    categoryId: '1',
    weight: '850',
    images: [
      {
        key: 'example.jpg',
        isFeatured: true,
      },
    ],
  };

  it('should return 401 if user is not admin', async () => {
    const response = await request(app).post('/product/create').send(validData);
    expect(response.status).toBe(401);
  });

  it('should return 403 if name is not provided', async () => {
    const accessToken = signin();
    const response = await request(app)
      .post('/product/create')
      .set('Cookie', [`accessToken=${accessToken}`])
      .send({
        ...validData,
        name: '',
      });
    expect(response.status).toBe(403);
  });

  it('should return 200 if user is admin and data is valid', async () => {
    const accessToken = signin();
    const response = await request(app)
      .post('/product/create')
      .set('Cookie', [`accessToken=${accessToken}`])
      .send(validData);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe(validData.name);
    expect(response.body.description).toBe(validData.description);
    expect(response.body.stock).toBe(validData.stock);
    expect(response.body.price).toBe(validData.price);
    expect(response.body.categoryId).toBe(validData.categoryId);
    expect(response.body.weight).toBe(validData.weight);
    expect(response.body.images).toEqual(validData.images);
  });

  it('should return 400 if provided category id is not valid', async () => {
    // todo add test
    expect(true).toBe(true);
  });
});
