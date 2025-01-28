import { Router } from 'express'
import {  findAll, findOne, add, update, remove,login, logout} from './auth.controler.js'
import { UserSchema, LoginSchema, PartialUserSchema } from './auth.entity.js'
import { validateWithSchema , validateObjectId} from '../shared/db/middleware.js'
import { sanitizeAuthInput, verifyToken,authorizeUserRoles } from './auth.middleware.js'

 export const authRouter = Router()
  authRouter.post(
    "/register",
    validateWithSchema(UserSchema), // Validate user registration
    sanitizeAuthInput, // Sanitize and hash password
    add // Controller to add user
  );

  authRouter.post(
    "/login",
    validateWithSchema(LoginSchema), // Validate login
    login // Controller to handle login
  );

  authRouter.get(
    "/:id",
    validateObjectId("id"), // Validate ObjectId
    findOne // Controller to find user by ID
  );

  authRouter.put(
    "/:id",
    validateObjectId("id"), // Validate ObjectId
    validateWithSchema(UserSchema),
    sanitizeAuthInput, // Validate user data
    update // Controller to update user
  );

  authRouter.patch(
  "/:id",
  validateObjectId("id"), // Validate ObjectId
  validateWithSchema(PartialUserSchema), // Validate with the partial schema
  sanitizeAuthInput, // Sanitize and hash password
  update // Controller to update user
);

  authRouter.delete(
    "/:id",
    validateObjectId("id"), // Validate ObjectId
    remove // Controller to delete user
  );
  authRouter.get('/', findAll);

  authRouter.post(
    '/logout',
    verifyToken,
    authorizeUserRoles('admin', 'user'), 
    logout
  );