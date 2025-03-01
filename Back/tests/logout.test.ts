import { app } from '../src/app.js';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { env } from '../src/config_env/config.js';
import { jest } from "@jest/globals";


const secret = env.JWT_SECRET ||'secret';

// Genera un token válido para el usuario con id "user123" y rol "user"
const token = jwt.sign({ id: "67be5c3fbba49531b3c3cdf9", role: "user" }, secret, { expiresIn: "1h" });
beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});
describe('/api/auth/logout', () => {

  test('should return 401 if the token is invalid', async () => {
    const response = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer invalidtoken`);
    expect(response.status).toBe(401);
  });

  test('should return 401 if the token is missing', async () => {
    const response = await request(app)
      .post('/api/auth/logout');
    expect(response.status).toBe(401);
  });

  test('should return 403 if the token is guest', async () => {
    // Genera un token con rol "guest" para simular ese caso
    const guestToken = jwt.sign({ id: "guest", role: "guest" }, secret, { expiresIn: "1h" });
    const response = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${guestToken}`);
    expect(response.status).toBe(403);
  });
    test('should return 200 if the token is valid', async () => {
    const response = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });

});