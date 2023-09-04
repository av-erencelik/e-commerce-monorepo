import app from '../../app';
import request from 'supertest';
import { signin } from './test-utils';
import db from '../../database/sql';
import { image, product, productPrice } from '../../models/schema';

describe('Create product route', () => {
  const validData = {
    name: 'test',
    description: 'test',
    stock: 10,
    price: 10.6,
    categoryId: 1,
    weight: 850,
    images: [
      {
        key: 'example.jpg',
        isFeatured: true,
      },
    ],
  };

  beforeEach(async () => {
    await db.delete(product);
    await db.delete(productPrice);
    await db.delete(image);
  });

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
    expect(response.body.product.name).toBe(validData.name);
    expect(response.body.product.description).toBe(validData.description);
  });

  it('should return 403 if provided stock, weight, price, categoryId is string', async () => {
    const accessToken = signin();
    const response = await request(app)
      .post('/product/create')
      .set('Cookie', [`accessToken=${accessToken}`])
      .send({
        ...validData,
        stock: '10',
        weight: '850',
        price: '10.6',
        categoryId: '1',
      });

    expect(response.status).toBe(403);
  });

  it('should return 200 even if weight is not provided', async () => {
    const accessToken = signin();
    const response = await request(app)
      .post('/product/create')
      .set('Cookie', [`accessToken=${accessToken}`])
      .send({
        ...validData,
        weight: undefined,
      });

    expect(response.status).toBe(200);
  });

  it('should return 400 if provided image is not uploaded to s3', async () => {
    const accessToken = signin();
    const response = await request(app)
      .post('/product/create')
      .set('Cookie', [`accessToken=${accessToken}`])
      .send({
        ...validData,
        images: [
          {
            key: 'notvalid.jpg',
            isFeatured: true,
          },
        ],
      });

    expect(response.status).toBe(400);
  });

  it('should return 200 even if provided image is more than one', async () => {
    const accessToken = signin();
    const response = await request(app)
      .post('/product/create')
      .set('Cookie', [`accessToken=${accessToken}`])
      .send({
        ...validData,
        images: [
          {
            key: 'example.jpg',
            isFeatured: true,
          },
          {
            key: 'example-2.png',
            isFeatured: false,
          },
        ],
      });

    expect(response.status).toBe(200);
  });

  it('should return 400 if provided images has more than one featured image', async () => {
    const accessToken = signin();
    const response = await request(app)
      .post('/product/create')
      .set('Cookie', [`accessToken=${accessToken}`])
      .send({
        ...validData,
        images: [
          {
            key: 'example.jpg',
            isFeatured: true,
          },
          {
            key: 'example-2.png',
            isFeatured: true,
          },
        ],
      });

    expect(response.status).toBe(400);
  });

  it('should return 400 if provided category id is not valid', async () => {
    // todo add test
    expect(true).toBe(true);
  });
});
