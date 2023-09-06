import app from '../../app';
import request from 'supertest';
import axios from 'axios';
import { signin } from './test-utils';
import fs from 'fs';
import db from '../../database/sql';
import { category, image, product, productPrice } from '../../models/schema';

describe('Image routes', () => {
  let key = '';
  let productId = 0;
  beforeAll(async () => {
    await db.delete(product);
    await db.delete(productPrice);
    await db.delete(image);
    await db.delete(category);
    const token = signin();
    const categoryResponse = await request(app)
      .post('/product/category')
      .set('Cookie', [`accessToken=${token}`])
      .send({
        name: 'test',
        description: 'test',
      });

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

    key = response.body[0].key;

    const imageBuffer = fs.readFileSync(
      './apps/product/src/__test__/integration/test.png'
    );

    await axios.put(response.body[0].url, imageBuffer);
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
            key: response.body[0].key,
            isFeatured: true,
          },
          {
            key: 'example.jpg',
            isFeatured: false,
          },
        ],
        categoryId: categoryResponse.body.category.id,
      });

    productId = productResponse.body.product.id;
  });

  afterAll(async () => {
    await db.delete(product);
    await db.delete(productPrice);
    await db.delete(image);
    await db.delete(category);
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

    await axios.put(signedUrlResponse.body[0].url, imageBuffer);

    const response = await request(app)
      .post(`/product/image/${productId}`)
      .set('Cookie', [`accessToken=${token}`])
      .send({
        key: signedUrlResponse.body[0].key,
        isFeatured: false,
      });
    expect(response.status).toBe(201);
    // delete image after

    const deleteResponse = await request(app)
      .delete(`/product/image/${signedUrlResponse.body[0].key}`)
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
