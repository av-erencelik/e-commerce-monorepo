import request from 'supertest';
import app from '../../app';

it('test', async () => {
  await request(app).get('/api').expect(200);
});
