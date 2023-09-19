import app from '../../app';
import request from 'supertest';
import axios from 'axios';
import { signin } from './test-utils';
import fs from 'fs';
import db from '../../database/sql';
import {
  category,
  image,
  product,
  productPrice,
  subCategory,
} from '../../models/schema';
import { deleteImageFromS3 } from '../../lib/s3';

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

describe('Image routes', () => {
  let key = '';
  let productId = 0;
  beforeAll(async () => {
    await db.delete(product);
    await db.delete(productPrice);
    await db.delete(image);
    await db.delete(category);
    await db.delete(subCategory);
    const token = signin();
    await db
      .insert(category)
      .values({ name: 'test', description: 'test', id: 1 });
    await db
      .insert(subCategory)
      .values({ name: 'test', description: 'test', id: 1, categoryId: 1 });
    const response = await request(app)
      .post('/product/image')
      .set('Cookie', [`accessToken=${token}`])
      .send({
        images: [
          {
            name: 'test',
            type: 'image/png',
          },
        ],
      });

    key = response.body.images[0].key;

    const imageBuffer = fs.readFileSync(
      './apps/product/src/__test__/integration/test.png'
    );

    await axios.put(response.body.images[0].url, imageBuffer);
    const productResponse = await request(app)
      .post('/product/create')
      .set('Cookie', [`accessToken=${token}`])
      .send({
        name: 'testing',
        description: 'testing',
        price: 10,
        weight: 10,
        stock: 10,
        images: [
          {
            key: response.body.images[0].key,
            isFeatured: true,
          },
          {
            key: 'example.jpg',
            isFeatured: false,
          },
        ],
        categoryId: 1,
        subCategoryId: 1,
      });

    productId = productResponse.body.product.id;
  });

  afterAll(async () => {
    await db.delete(product);
    await db.delete(productPrice);
    await db.delete(image);
    await db.delete(category);
    await db.delete(subCategory);
    await deleteImageFromS3(key);
  });

  it('should update image data', async () => {
    const token = signin();
    const response = await request(app)
      .patch(`/product/image/example.jpg`)
      .set('Cookie', [`accessToken=${token}`])
      .send();
    expect(response.status).toBe(204);
  });

  it('should delete image', async () => {
    const token = signin();
    const response = await request(app)
      .delete(`/product/image/${key}`)
      .set('Cookie', [`accessToken=${token}`])
      .send();
    expect(response.status).toBe(204);
  });

  it('should create image and delete successfully', async () => {
    const token = signin();
    const signedUrlResponse = await request(app)
      .post('/product/image')
      .set('Cookie', [`accessToken=${token}`])
      .send({
        images: [
          {
            name: 'test',
            type: 'image/png',
          },
        ],
      });

    const imageBuffer = fs.readFileSync(
      './apps/product/src/__test__/integration/test.png'
    );

    await axios.put(signedUrlResponse.body.images[0].url, imageBuffer);

    const response = await request(app)
      .post(`/product/image/${productId}`)
      .set('Cookie', [`accessToken=${token}`])
      .send({
        key: signedUrlResponse.body.images[0].key,
        isFeatured: false,
      });
    expect(response.status).toBe(201);
    // delete image after

    const deleteResponse = await request(app)
      .delete(`/product/image/${signedUrlResponse.body.images[0].key}`)
      .set('Cookie', [`accessToken=${token}`])
      .send();
    expect(deleteResponse.status).toBe(204);
  });

  it('should return 404 if image is not found', async () => {
    const token = signin();
    const response = await request(app)
      .delete(`/product/image/notfound`)
      .set('Cookie', [`accessToken=${token}`])
      .send();
    expect(response.status).toBe(404);
  });

  it('should return 400 if image is featured', async () => {
    const token = signin();
    const response = await request(app)
      .delete(`/product/image/example.jpg`)
      .set('Cookie', [`accessToken=${token}`])
      .send();
    expect(response.status).toBe(400);
  });
});
