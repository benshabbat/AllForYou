import request from 'supertest';
import app from './index.js';

describe('Test API Endpoints', () => {
  it('should fetch all meals', async () => {
    const res = await request(app).get('/api/meals');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});