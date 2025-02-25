import { Router } from 'express'
import {  findAll, findOne, add, update, remove,login, logout} from './auth.controler.js'
import { UserSchema, LoginSchema, PartialUserSchema } from './auth.entity.js'
import { validateWithSchema , validateObjectId,validateUniqueField} from '../shared/db/middleware.js'
import { sanitizeAuthInput, verifyToken,authorizeUserRoles } from './auth.middleware.js'
import { orm } from '../shared/db/orm.js'; // for the unique field middleware
import { User } from './auth.entity.js'; // for the unique field middleware

const em = orm.em;
const unique = validateUniqueField(em.getRepository(User), 'username');

 export const authRouter = Router()
  authRouter.get('/', findAll);
  authRouter.get("/:id", validateObjectId("id"), findOne);
  authRouter.post( "/register", validateWithSchema(UserSchema), sanitizeAuthInput, unique, add);
  authRouter.post( "/login", validateWithSchema(LoginSchema), login);
  authRouter.post('/logout', verifyToken, authorizeUserRoles('admin', 'user'), logout);//is only for testing
  authRouter.put("/:id",validateObjectId("id"), validateWithSchema(UserSchema), sanitizeAuthInput, unique, update);
  authRouter.patch("/:id",validateObjectId("id"), validateWithSchema(PartialUserSchema), sanitizeAuthInput, unique, update);
  authRouter.delete("/:id", validateObjectId("id"), remove);
  


  