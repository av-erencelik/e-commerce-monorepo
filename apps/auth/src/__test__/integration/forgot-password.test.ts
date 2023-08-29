import app from '../../app';
import request from 'supertest';
import db from '../../database/sql';
import { users } from '../../models/user';
import { signin } from './test-utils';
import httpStatus from 'http-status';
import { randomUUID } from 'crypto';

jest.mock('@e-commerce-monorepo/event-bus', () => ({
  UserResetPassword: jest.fn().mockImplementation(() => ({
    publish: jest.fn(),
  })),
  UserCreated: jest.fn().mockImplementation(() => ({
    publish: jest.fn(),
  })),
  UserVerified: jest.fn().mockImplementation(() => ({
    publish: jest.fn(),
  })),
  UserPasswordChange: jest.fn().mockImplementation(() => ({
    publish: jest.fn(),
  })),
}));

describe('forgot-password workflow', () => {
  beforeEach(async () => {
    await db.delete(users);
  });
  afterAll(async () => {
    await db.delete(users);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 403 if email is not provided', async () => {
    const response = await request(app).post('/auth/forgot-password').send();
    expect(response.status).toBe(httpStatus.FORBIDDEN);
    expect(response.body.errors[0].message).toBe('Required');
  });

  it('should send a reset password email if email provided', async () => {
    await signin();
    const response = await request(app)
      .post('/auth/forgot-password')
      .send({ email: 'test@example.com' });
    expect(response.status).toBe(httpStatus.OK);
  });

  it('should return ok even if email is not found', async () => {
    const response = await request(app)
      .post('/auth/forgot-password')
      .send({ email: 'test@example.com' });
    expect(response.status).toBe(httpStatus.OK);
  });

  it('should return 403 if token is not provided', async () => {
    const response = await request(app).put('/auth/reset-password');
    expect(response.status).toBe(httpStatus.FORBIDDEN);
    expect(response.body.errors[0].message).toBe('Required');
  });

  it('should return 401 if token is invalid', async () => {
    const uuid = randomUUID();
    const response = await request(app)
      .put(`/auth/reset-password?token=${uuid}&id=123`)
      .send({
        password: 'password',
        passwordConfirmation: 'password',
      });
    console.log(response.body);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    expect(response.body.message).toBe('Invalid token');
  });

  it('should return 403 if passwords is not provided', async () => {
    const response = await request(app).put('/auth/reset-password?token=123');
    expect(response.status).toBe(httpStatus.FORBIDDEN);
  });

  it('should return 403 if passwords do not match', async () => {
    const response = await request(app)
      .put('/auth/reset-password?token=123')
      .send({
        password: 'password',
        passowrdConfirmation: 'differentpassword',
      });
    expect(response.status).toBe(httpStatus.FORBIDDEN);
  });
});
