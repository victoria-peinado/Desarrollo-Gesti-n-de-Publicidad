// import request from 'supertest';
// import { app } from '../src/app.js';
// import { em } from '../db'; // Simula la base de datos
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';

// // Mock de la base de datos
// jest.mock('../db', () => ({
//   em: {
//     findOneOrFail: jest.fn(),
//   },
// }));

// describe('Auth Controller', () => {
//   const mockUser = {
//     id: '123',
//     username: 'testuser',
//     password: bcrypt.hashSync('password123', 10),
//     role: 'user',
//   };

//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   /** ====================== 🟢 LOGIN TESTS ====================== **/

//   it('should log in a user with correct credentials', async () => {
//     (em.findOneOrFail as jest.Mock).mockResolvedValue(mockUser);

//     const res = await request(app)
//       .post('/login')
//       .send({ username: 'testuser', password: 'password123' });

//     expect(res.status).toBe(200);
//     expect(res.body.message).toBe('User logged in successfully');
//     expect(res.body.data.token).toBeDefined();
//   });

//   it('should return 401 for invalid credentials', async () => {
//     (em.findOneOrFail as jest.Mock).mockResolvedValue(mockUser);

//     const res = await request(app)
//       .post('/login')
//       .send({ username: 'testuser', password: 'wrongpassword' });

//     expect(res.status).toBe(401);
//     expect(res.body.message).toBe('Invalid credentials');
//   });

//   it('should return 500 if user not found', async () => {
//     (em.findOneOrFail as jest.Mock).mockRejectedValue(new Error('User not found'));

//     const res = await request(app)
//       .post('/login')
//       .send({ username: 'nonexistentuser', password: 'password123' });

//     expect(res.status).toBe(500);
//     expect(res.body.message).toBe('User not found');
//   });

//   /** ====================== 🔍 FIND USER TESTS ====================== **/

//   it('should return a user if found', async () => {
//     (em.findOneOrFail as jest.Mock).mockResolvedValue(mockUser);

//     const res = await request(app).get('/user/123');

//     expect(res.status).toBe(200);
//     expect(res.body.message).toBe('User found successfully');
//     expect(res.body.data.username).toBe('testuser');
//   });

//   it('should return 500 if user is not found', async () => {
//     (em.findOneOrFail as jest.Mock).mockRejectedValue(new Error('User not found'));

//     const res = await request(app).get('/user/999');

//     expect(res.status).toBe(500);
//     expect(res.body.message).toBe('User not found');
//   });

//   /** ====================== 🔴 LOGOUT TESTS ====================== **/

//   it('should return 200 on logout', async () => {
//     const res = await request(app).post('/logout');

//     expect(res.status).toBe(200);
//     expect(res.body.message).toBe('User logged out successfully');
//   });
// });