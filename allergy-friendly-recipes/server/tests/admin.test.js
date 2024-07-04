import request from 'supertest';
import app from '../index.js';

describe('Admin Routes', () => {
  it('should register a new admin', async () => {
    const res = await request(app).post('/api/admin/register').send({
      username: 'admin',
      password: 'password',
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
  });

  it('should log in an admin', async () => {
    const res = await request(app).post('/api/admin/login').send({
      username: 'admin',
      password: 'password',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});