import jwt from 'jsonwebtoken';
import request from 'supertest';
import app from '../../app';
import httpStatus from 'http-status';
import { validate } from 'uuid';
import { AccessTokenPayload } from '@e-commerce-monorepo/utils';
import config from '../../config/config';
import authRedis from '../../repository/auth.redis';
import db from '../../database/sql';
import { users } from '../../models/schema';

jest.mock('@e-commerce-monorepo/event-bus', () => ({
  UserCreated: jest.fn().mockImplementation(() => ({
    publish: jest.fn(),
  })),
}));

describe('signup Route', () => {
  const validData = {
    email: 'test@example.com',
    fullName: 'John Doe',
    password: 'password',
    passwordConfirmation: 'password',
    countryCode: 'US',
    phoneNumber: '6204978718',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await db.delete(users);
  });
  it('should return 403 if passwords do not match', async () => {
    const invalidData = {
      email: 'test@example.com',
      fullName: 'John Doe',
      password: 'password',
      passwordConfirmation: 'differentpassword',
      countryCode: 'US',
      phoneNumber: '6204978718',
    };
    const response = await request(app)
      .post('/auth/signup')
      .send(invalidData)
      .expect(httpStatus.FORBIDDEN);
    expect(response.body.errors[0].message).toBe('Passwords do not match');
  });

  it('should return 403 if country code is invalid', async () => {
    const invalidData = {
      email: 'test@example.com',
      fullName: 'John Doe',
      password: 'password',
      passwordConfirmation: 'password',
      countryCode: '12',
      phoneNumber: '6204978718',
    };
    const response = await request(app)
      .post('/auth/signup')
      .send(invalidData)
      .expect(httpStatus.FORBIDDEN);
    expect(response.body.errors[0].message).toBe('Invalid country code');
  });

  it('should return 403 if phone number is invalid', async () => {
    const invalidData = {
      email: 'test@example.com',
      fullName: 'John Doe',
      password: 'password',
      passwordConfirmation: 'password',
      countryCode: 'US',
      phoneNumber: 'invalid',
    };
    const response = await request(app)
      .post('/auth/signup')
      .send(invalidData)
      .expect(httpStatus.FORBIDDEN);
    expect(response.body.errors[0].message).toBe('Invalid phone number');
  });

  it('should return 403 if phone number is invalid for country code', async () => {
    const invalidData = {
      email: 'test@example.com',
      fullName: 'John Doe',
      password: 'password',
      passwordConfirmation: 'password',
      countryCode: 'US',
      phoneNumber: '1234567809',
    };
    const response = await request(app)
      .post('/auth/signup')
      .send(invalidData)
      .expect(httpStatus.FORBIDDEN);
    expect(response.body.errors[0].message).toBe('Invalid phone number');
  });

  it('should return 403 if email is invalid', async () => {
    const invalidData = {
      email: 'invalid',
      fullName: 'John Doe',
      password: 'password',
      passwordConfirmation: 'password',
      countryCode: 'US',
      phoneNumber: '6204978718',
    };
    const response = await request(app)
      .post('/auth/signup')
      .send(invalidData)
      .expect(httpStatus.FORBIDDEN);
    expect(response.body.errors[0].message).toBe('Invalid email');
  });

  it('should return 200 with refresh and access tokens and should store refreshToken on redis if credentials is valid', async () => {
    const response = await request(app)
      .post('/auth/signup')
      .send(validData)
      .expect(httpStatus.CREATED);
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

  it('should return 409 if email is already in use', async () => {
    const response = await request(app)
      .post('/auth/signup')
      .send(validData)
      .expect(httpStatus.CONFLICT);
    expect(response.body.message).toBe('Email or phone number already in use');
  });

  it('should return 409 if phone number is already in use', async () => {
    const response = await request(app)
      .post('/auth/signup')
      .send({
        ...validData,
        email: 'test2@example.com',
      })
      .expect(httpStatus.CONFLICT);
    expect(response.body.message).toBe('Email or phone number already in use');
  });
});
