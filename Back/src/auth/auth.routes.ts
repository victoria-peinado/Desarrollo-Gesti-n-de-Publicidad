import { Router } from 'express'
import {  findAll, findOne, add, update, remove,login, logout} from './auth.controler.js'
import { UserSchema, LoginSchema, PartialUserSchema } from './auth.entity.js'
import { validateWithSchema , validateObjectId} from '../shared/db/middleware.js'
import { sanitizeAuthInput, verifyToken,authorizeUserRoles } from './auth.middleware.js'


 export const authRouter = Router()
  authRouter.get('/',verifyToken, authorizeUserRoles('admin'), findAll);
  authRouter.get("/:id",verifyToken, authorizeUserRoles('admin'), validateObjectId("id"), findOne);
  authRouter.post( "/register", validateWithSchema(UserSchema), sanitizeAuthInput,add);
  authRouter.post( "/login", validateWithSchema(LoginSchema), login);
  authRouter.post('/logout', verifyToken, logout);//is only for testing
  authRouter.put("/:id",verifyToken, authorizeUserRoles('admin'),validateObjectId("id"), validateWithSchema(UserSchema), sanitizeAuthInput, update);
  authRouter.patch("/:id",verifyToken, authorizeUserRoles('admin'),validateObjectId("id"), validateWithSchema(PartialUserSchema), sanitizeAuthInput,  update);
  authRouter.delete("/:id",verifyToken, authorizeUserRoles('admin'), validateObjectId("id"), remove);
  


  