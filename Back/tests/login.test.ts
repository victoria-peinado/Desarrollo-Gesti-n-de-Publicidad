
 import { app } from '../src/app.js';
 import request from 'supertest';

describe('/api/auth/login', () => {
  test('should return 200 and a token if the credentials are correct', async () => {

    const response = await request(app)
      .post('/api/auth/login')
      .send({ 
        username: 'admin',
        password: 'admin'
      });
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('token');
  });
  test('should return 401 if the credentials are incorrect', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ 
        username: 'admin',
        password: 'incorrect'
      });
    expect(response.status).toBe(401);
  });
} );