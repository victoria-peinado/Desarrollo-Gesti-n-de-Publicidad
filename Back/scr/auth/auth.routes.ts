import { Router } from 'express'
import {  findAll, findOne, add, update, remove,login, logout} from './auth.controler.js'
import { validUser,validLogin, sanitizeAuthInput, verifyToken, authorizeUserRoles } from './auth.middleware.js'
import { validateInput ,checkID} from '../shared/db/middleware.js'; 

export const authRouter = Router()

authRouter.post('/login',
  validLogin(),
  validateInput,
   login);

authRouter.post('/logout',
  verifyToken, // Primero verifica el token
  (req, res, next) => authorizeUserRoles(req, res, next, 'admin', 'user'), // Define los roles permitidos
  logout
);

authRouter.post('/register',
  validUser(),
  validateInput,
  sanitizeAuthInput, add);
authRouter.get('/', findAll);
authRouter.get('/:id',
  checkID(),
  validateInput,
  findOne);
authRouter.put('/:id', 
  checkID(),
  validateInput,
  update);
authRouter.delete('/:id', 
  checkID(),
  validateInput,
  remove);


