import app from '../../app';
import request from 'supertest';
import db from '../../database/sql';
import { users } from '../../models/schema';
import { signin } from './test-utils';
import httpStatus from 'http-status';

jest.mock('@e-commerce-monorepo/event-bus', () => ({
  UserCreated: jest.fn().mockImplementation(() => ({
    publish: jest.fn(),
  })),
}));

describe('current-user Route', () => {
  beforeEach(async () => {
    await db.delete(users);
  });
  afterAll(async () => {
    await db.delete(users);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if no access token is provided', async () => {
    const response = await request(app).get('/auth/current-user');
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    expect(response.body.message).toBe('Not authorized');
  });

  it('should return 401 if access token is invalid', async () => {
    const response = await request(app)
      .get('/auth/current-user')
      .set('Cookie', 'accessToken=invalidtoken');
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    expect(response.body.message).toBe('Invalid access token');
  });

  it('should return 200 if access token is valid', async () => {
    const { accessToken } = await signin();
    const response = await request(app)
      .get('/auth/current-user')
      .set('Cookie', `accessToken=${accessToken}`);
    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toHaveProperty('user');
  });

  it('should user object if access token is valid', async () => {
    const { accessToken } = await signin();
    const response = await request(app)
      .get('/auth/current-user')
      .set('Cookie', `accessToken=${accessToken}`);
    expect(response.status).toBe(httpStatus.OK);
    expect(response.body.user).toBeDefined();
    expect(response.body.user.email).toBeDefined();
    expect(response.body.user.userId).toBeDefined();
    expect(response.body.user.verificated).toBeDefined();
    expect(response.body.user.fullName).toBeDefined();
  });
});
