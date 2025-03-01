import request from 'supertest';
import { app } from '../src/app.js';
let server: any;
beforeAll(async () => {
  server = app.listen(3071, () => {
    console.log('Server running on http://localhost:3001');
  });
});

afterAll(() => {
  server.close();
});

describe('App Initialization', () => {
  test('should initialize without errors', () => {
    console.log('App is initializing');
    expect(app).toBeDefined();
  });
});