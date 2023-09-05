import app from '../../app';
import request from 'supertest';
import axios from 'axios';
import { signin } from './test-utils';
import fs from 'fs';

describe('Image routes', () => {
  let key = '';
  beforeAll(async () => {
    const token = signin();
    await request(app)
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
    await request(app)
      .post('/product/create')
      .set('Cookie', [`accessToken=${token}`])
      .send({
        name: 'test',
        description: 'test',
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
        categoryId: 1,
      });
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
