import app from '../../app';
import request from 'supertest';
import db from '../../database/sql';
import { users } from '../../models/user';
import { signin } from './test-utils';
import httpStatus from 'http-status';

jest.mock('@e-commerce-monorepo/event-bus', () => ({
  UserCreated: jest.fn().mockImplementation(() => ({
    publish: jest.fn(),
  })),
}));

describe('current-user Route', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await db.delete(users);
  });
  afterAll(async () => {
    await db.delete(users);
  });

  it('should return 401 if no refresh token is provided', async () => {
    const response = await request(app).post('/auth/refresh-token');
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    expect(response.body.message).toBe('Not authorized');
  });

  it('should return 401 if refresh token is invalid', async () => {
    const response = await request(app)
      .post('/auth/refresh-token')
      .set('Cookie', 'refreshToken=invalidtoken');
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    expect(response.body.message).toBe('Invalid refresh token');
  });

  it('should return 200 if refresh token is valid', async () => {
    const { refreshToken } = await signin();
    const response = await request(app)
      .post('/auth/refresh-token')
      .set('Cookie', `refreshToken=${refreshToken}`);
    expect(response.status).toBe(httpStatus.OK);
    expect(response.body.message).toBe('Tokens refreshed successfully');
  });

  it('should return new access and refresh tokens if refresh token is valid', async () => {
    const { refreshToken } = await signin();
    const response = await request(app)
      .post('/auth/refresh-token')
      .set('Cookie', `refreshToken=${refreshToken}`);
    expect(response.status).toBe(httpStatus.OK);
    const cookies = response.get('Set-Cookie');
    let newRefreshToken: string | undefined;
    let newAccessToken: string | undefined;
    for (const cookie of cookies) {
      if (cookie.startsWith('refreshToken=')) {
        newRefreshToken = cookie.split(';')[0].split('=')[1];
      } else {
        newAccessToken = cookie.split(';')[0].split('=')[1];
      }
    }
    expect(newRefreshToken).toBeDefined();
    expect(newAccessToken).toBeDefined();
    expect(newRefreshToken).not.toBe(refreshToken);
  });
});
