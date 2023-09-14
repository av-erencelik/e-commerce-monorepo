import app from '../../app';
import request from 'supertest';
import { signin } from './test-utils';
import db from '../../database/sql';
import {
  category,
  image,
  product,
  productPrice,
  subCategory,
} from '../../models/schema';

jest.mock('@e-commerce-monorepo/event-bus', () => ({
  ProductCreated: jest.fn().mockImplementation(() => ({
    publish: jest.fn(),
  })),
  ProductUpdated: jest.fn().mockImplementation(() => ({
    publish: jest.fn(),
  })),
  ProductDeleted: jest.fn().mockImplementation(() => ({
    publish: jest.fn(),
  })),
  ProductPriceDeleted: jest.fn().mockImplementation(() => ({
    publish: jest.fn(),
  })),
  ProductPriceUpdated: jest.fn().mockImplementation(() => ({
    publish: jest.fn(),
  })),
  ProductStockUpdated: jest.fn().mockImplementation(() => ({
    publish: jest.fn(),
  })),
}));

describe('Create product route', () => {
  const validData = {
    name: 'test',
    description: 'test',
    stock: 10,
    price: 10.6,
    categoryId: 1,
    subCategoryId: 1,
    weight: 850,
    images: [
      {
        key: 'example.jpg',
        isFeatured: true,
      },
    ],
  };

  beforeAll(async () => {
    await db.delete(category);
    await db.delete(product);
    await db.delete(productPrice);
    await db.delete(image);
    await db.delete(subCategory);
  });

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

  it('should return 400 if category is not exist', async () => {
    const accessToken = signin();
    const response = await request(app)
      .post('/product/create')
      .set('Cookie', [`accessToken=${accessToken}`])
      .send(validData);
    expect(response.status).toBe(400);
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

  describe('Add product route success', () => {
    beforeAll(async () => {
      await db.insert(category).values({
        name: 'test',
        description: 'test',
        id: 1,
      });
      await db.insert(subCategory).values({
        name: 'test',
        description: 'test',
        id: 1,
        categoryId: 1,
      });
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
  });
});
