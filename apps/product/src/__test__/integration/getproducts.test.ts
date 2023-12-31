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

describe('Get products route', () => {
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
    await db.delete(subCategory);
    await db.delete(product);
    await db.delete(productPrice);
    await db.delete(image);
    const accessToken = signin();
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
    await request(app)
      .post('/product/create')
      .set('Cookie', [`accessToken=${accessToken}`])
      .send(validData);
  });

  afterAll(async () => {
    await db.delete(category);
    await db.delete(product);
    await db.delete(productPrice);
    await db.delete(image);
  });

  it('should return 200 with image urls signed', async () => {
    const response = await request(app).get('/product');
    expect(response.status).toBe(200);
    console.log(response.body);
    expect(response.body.products[0].images[0].url).toBeDefined();
  });
});
