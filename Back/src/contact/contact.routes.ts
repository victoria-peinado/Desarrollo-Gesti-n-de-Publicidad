import { Router } from "express";
import { findAll, findOne, add, update, remove, sanitizeContactInput, getContactByDni  } from "./contact.controler.js";
import { validateWithSchema , validateObjectId, validateDni} from '../shared/db/middleware.js'
import { ContactSchema, ParcialContactSchema } from "./contact.entity.js";
import {  verifyToken,authorizeUserRoles } from '../auth/auth.middleware.js'

export const contactRouter = Router()

contactRouter.get('/',verifyToken, authorizeUserRoles('admin'), findAll)
contactRouter.get('/:id',verifyToken, authorizeUserRoles('admin'),validateObjectId('id'), findOne)
contactRouter.post('/',verifyToken, authorizeUserRoles('admin'),validateWithSchema(ContactSchema) ,sanitizeContactInput, add)
contactRouter.put('/:id',verifyToken, authorizeUserRoles('admin'),validateObjectId('id'),validateWithSchema(ContactSchema)  ,sanitizeContactInput, update)
contactRouter.patch('/:id',verifyToken, authorizeUserRoles('admin'),validateObjectId('id'),validateWithSchema(ParcialContactSchema) , sanitizeContactInput, update)
contactRouter.delete('/:id',verifyToken, authorizeUserRoles('admin'),validateObjectId('id'), remove)
contactRouter.get('/dni/:dni',verifyToken, authorizeUserRoles('admin'), validateDni('dni'), getContactByDni);


