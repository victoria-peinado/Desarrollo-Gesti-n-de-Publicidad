import { Router } from 'express'
import { sanitizeAuthInput, findAll, findOne, add, update, remove,login, logout,verifyToken, authorizeUserRoles} from './auth.controler.js'

export const authRouter = Router()

authRouter.post('/login', login);

authRouter.post(
  '/logout',
  verifyToken, // Primero verifica el token
  (req, res, next) => authorizeUserRoles(req, res, next, 'admin', 'user'), // Define los roles permitidos
  logout
);

authRouter.post('/register', sanitizeAuthInput, add);
authRouter.get('/', findAll);
authRouter.get('/:id', findOne);
authRouter.put('/:id', update);
authRouter.delete('/:id', remove);


