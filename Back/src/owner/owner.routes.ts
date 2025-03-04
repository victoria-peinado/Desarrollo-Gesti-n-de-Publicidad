import { Router } from "express";
import { findAll, findOne, add, update, remove, sanitizeOwnerInput, getOwnerByCuit } from "./owner.controler.js";
import { OwnerSchema,ParcialOwnerSchema } from './owner.entity.js'
import { validateWithSchema , validateObjectId, validateCuit} from '../shared/db/middleware.js'
import {  verifyToken,authorizeUserRoles } from '../auth/auth.middleware.js'

export const ownerRouter = Router()

ownerRouter.get('/',verifyToken, authorizeUserRoles('admin'),  findAll)
ownerRouter.get('/:id',verifyToken, authorizeUserRoles('admin'),validateObjectId('id'),findOne)
ownerRouter.post('/',verifyToken, authorizeUserRoles('admin'),validateWithSchema(OwnerSchema),sanitizeOwnerInput, add)
ownerRouter.put('/:id',verifyToken, authorizeUserRoles('admin'),validateObjectId('id'),validateWithSchema(OwnerSchema),sanitizeOwnerInput, update)
ownerRouter.patch('/:id',verifyToken, authorizeUserRoles('admin'),validateObjectId('id'),validateWithSchema(ParcialOwnerSchema),sanitizeOwnerInput, update)
ownerRouter.delete('/:id',verifyToken, authorizeUserRoles('admin'),validateObjectId('id'), remove)
ownerRouter.get('/cuit/:cuit',verifyToken, authorizeUserRoles('admin'),validateCuit('cuit'), getOwnerByCuit);