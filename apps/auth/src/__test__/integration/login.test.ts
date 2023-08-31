import jwt from 'jsonwebtoken';
import db from '../../database/sql';
import { users } from '../../models/schema';
import app from '../../app';
import request from 'supertest';
import { validate } from 'uuid';
import authRedis from '../../repository/auth.redis';
import { AccessTokenPayload } from '@e-commerce-monorepo/utils';
import config from '../../config/config';

jest.mock('@e-commerce-monorepo/event-bus', () => ({
  UserCreated: jest.fn().mockImplementation(() => ({
    publish: jest.fn(),
  })),
}));

describe('login Route', () => {
  const validData = {
    email: 'test@example.com',
    fullName: 'John Doe',
    password: 'password',
    passwordConfirmation: 'password',
    countryCode: 'US',
    phoneNumber: '6204978718',
  };

  afterAll(async () => {
    await db.delete(users);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if email is not found', async () => {
    const response = await request(app).post('/auth/login').send({
      email: 'test2@example.com',
      password: 'password',
    });
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Incorrect credentials');
  });

  it('should return 401 if password is incorrect', async () => {
    await request(app).post('/auth/signup').send(validData);
    const response = await request(app).post('/auth/login').send({
      email: validData.email,
      password: 'wrongpassword',
    });
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Incorrect credentials');
  });

  it('should return 200 if email and password are correct', async () => {
    await request(app).post('/auth/signup').send(validData);
    const response = await request(app).post('/auth/login').send({
      email: validData.email,
      password: validData.password,
    });
    expect(response.status).toBe(200);
    const cookies = response.get('Set-Cookie');
    let refreshToken: string | undefined;
    let accessToken: string | undefined;
    for (const cookie of cookies) {
      if (cookie.startsWith('refreshToken=')) {
        refreshToken = cookie.split(';')[0].split('=')[1];
      } else {
        accessToken = cookie.split(';')[0].split('=')[1];
      }
    }
    expect(refreshToken).toBeDefined();
    expect(accessToken).toBeDefined();
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty('email');
    expect(response.body.user).toHaveProperty('userId');
    expect(response.body.user).toHaveProperty('verificated');
    expect(response.body.user).toHaveProperty('fullName');
    expect(response.body.user.email).toBe(validData.email);
    if (!refreshToken || !accessToken) {
      throw new Error('Refresh token or access token is undefined');
    }
    expect(validate(refreshToken)).toBe(true);
    const userPayload = await authRedis.getUserByRefreshToken(refreshToken);
    expect(userPayload).toBeDefined();
    if (!userPayload) {
      throw new Error('User payload is undefined');
    }
    expect(userPayload.email).toBe(validData.email);
    expect(accessToken).toBeDefined();
    const accessTokenPayload = jwt.verify(
      accessToken,
      config.jwt.secret
    ) as AccessTokenPayload;
    expect(accessTokenPayload.email).toBe(validData.email);
  });
});
