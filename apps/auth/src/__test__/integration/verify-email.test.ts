import app from '../../app';
import request from 'supertest';
import db from '../../database/sql';
import { users } from '../../models/schema';
import { signin } from './test-utils';

jest.mock('@e-commerce-monorepo/event-bus', () => ({
  UserCreated: jest.fn().mockImplementation(() => ({
    publish: jest.fn(),
  })),
  UserVerified: jest.fn().mockImplementation(() => ({
    publish: jest.fn(),
  })),
}));

describe('verify-email Route', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await db.delete(users);
  });
  afterAll(async () => {
    await db.delete(users);
  });

  it('should return 401 if no token is provided', async () => {
    const response = await request(app).post('/auth/verify-email');
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Not authorized');
  });

  it('should return 401 if token is invalid', async () => {
    const response = await request(app)
      .post('/auth/verify-email')
      .set('Cookie', 'token=invalidtoken');
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Not authorized');
  });

  it('should return 403 if user is valid but verification token is invalid or absent', async () => {
    const { accessToken } = await signin();
    await request(app)
      .post('/auth/verify-email')
      .set('Cookie', `accessToken=${accessToken}`)
      .expect(403);
  });
});
