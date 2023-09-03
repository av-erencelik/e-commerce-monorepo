import app from '../../app';
import request from 'supertest';
import { signin } from './test-utils';

describe('Image presign route', () => {
  it('should return 401 if user is not admin', async () => {
    const response = await request(app)
      .post('/product/image')
      .send({
        images: [
          {
            name: 'test',
            type: 'image/jpeg',
          },
        ],
      });
    expect(response.status).toBe(401);
  });

  it('should return 403 if name is not provided', async () => {
    const response = await request(app)
      .post('/product/image')
      .send({
        images: [
          {
            type: 'image/jpeg',
          },
        ],
      });
    expect(response.status).toBe(403);
  });

  it('should return 403 if type is not provided', async () => {
    const response = await request(app)
      .post('/product/image')
      .send({
        images: [
          {
            type: 'image/jpeg',
          },
        ],
      });
    expect(response.status).toBe(403);
  });

  it('should return 200 if user is admin', async () => {
    const accessToken = signin();
    const response = await request(app)
      .post('/product/image')
      .set('Cookie', [`accessToken=${accessToken}`])
      .send({
        images: [
          {
            name: 'test',
            type: 'image/jpeg',
          },
        ],
      });
    expect(response.status).toBe(200);
  });
});
