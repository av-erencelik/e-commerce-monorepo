import db from '../../database/sql';
import { users } from '../../models/user';
import app from '../../app';
import request from 'supertest';
import authRedis from '../../repository/auth.redis';
import { signin } from './test-utils';

jest.mock('@e-commerce-monorepo/event-bus', () => ({
  UserCreated: jest.fn().mockImplementation(() => ({
    publish: jest.fn(),
  })),
}));

describe('logout Route', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await db.delete(users);
  });
  afterAll(async () => {
    await db.delete(users);
  });
  it('should return 401 if no refresh token is provided', async () => {
    const response = await request(app).post('/auth/logout');
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('You need to login before logging out');
  });

  it('should return 401 if refresh token is invalid', async () => {
    const response = await request(app)
      .post('/auth/logout')
      .set('Cookie', 'refreshToken=invalidtoken');
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid refresh token');
  });

  it('should return 200 if refresh token is valid', async () => {
    const { refreshToken, accessToken } = await signin();
    const response = await request(app)
      .post('/auth/logout')
      .set('Cookie', [
        `refreshToken=${refreshToken};accessToken=${accessToken}`,
      ]);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Logout successful');
  });

  it('should delete refresh token from redis', async () => {
    const { refreshToken } = await signin();
    await request(app)
      .post('/auth/logout')
      .set('Cookie', `refreshToken=${refreshToken}`);
    if (refreshToken === undefined) {
      throw new Error('Refresh token is undefined');
    }
    const user = await authRedis.getUserByRefreshToken(refreshToken);
    expect(user).toBeNull();
  });

  it('should clear refresh and access token cookies', async () => {
    const { refreshToken } = await signin();
    const response = await request(app)
      .post('/auth/logout')
      .set('Cookie', `refreshToken=${refreshToken}`);
    const cookies = response.get('Set-Cookie');
    expect(cookies).toBeDefined();
    for (const cookie of cookies) {
      expect(cookie).toContain('Expires=Thu, 01 Jan 1970');
    }
  });

  it('should still be able to logout person even is no access token is provided', async () => {
    const { refreshToken } = await signin();
    const response = await request(app)
      .post('/auth/logout')
      .set('Cookie', `refreshToken=${refreshToken}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Logout successful');
  });
});
