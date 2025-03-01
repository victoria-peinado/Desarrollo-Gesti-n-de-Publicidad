import { app } from '../src/app.js';
import request from 'supertest';
import { orm } from '../src/shared/db/orm.js';
import { RequestContext } from '@mikro-orm/core';
import { User, UserRole } from '../src/auth/auth.entity.js'; // Asegúrate de la ruta correcta

describe('GET /api/auth', () => {
  test('should retrieve all users and reflect the addition of 2 new users', async () => {
    // Primer GET para obtener la cantidad actual de usuarios
    const initialResponse = await request(app).get('/api/auth');
    expect(initialResponse.status).toBe(200);
    const initialCount = initialResponse.body.data.length;

    // Insertar dos nuevos usuarios sin eliminar los anteriores
    await RequestContext.createAsync(orm.em, async () => {
      const user1 = orm.em.create(User, { 
        username: 'Juan Perez', 
        password: '123456',
        role: UserRole.USER
      });
      const user2 = orm.em.create(User, { 
        username: 'Maria Gonzalez', 
        password: 'aaabbbccc',
        role: UserRole.ADMIN
      });
      await orm.em.persistAndFlush([user1, user2]);
    });
    
    // Realizar un nuevo GET para obtener la cantidad actualizada de usuarios
    const newResponse = await request(app).get('/api/auth');
    expect(newResponse.status).toBe(200);
    const newCount = newResponse.body.data.length;
    
    // Verificar que la cantidad de usuarios aumentó en 2
    expect(newCount).toBe(initialCount + 2);
    
    // Verificar que los nuevos usuarios existen en la respuesta
    const newUser1 = newResponse.body.data.find((u: any) => u.username === 'Juan Perez');
    const newUser2 = newResponse.body.data.find((u: any) => u.username === 'Maria Gonzalez');
    
    expect(newUser1).toBeDefined();
    expect(newUser2).toBeDefined();
  });
});
