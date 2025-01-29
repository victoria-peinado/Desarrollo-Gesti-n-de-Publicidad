import { Router } from "express";
import { findAll, findOne, add, update, remove, sanitizeOwnerInput, getOwnerByCuit } from "./owner.controler.js";
import { OwnerSchema,ParcialOwnerSchema } from './owner.entity.js'
import { validateWithSchema , validateObjectId, validateCuit} from '../shared/db/middleware.js'
export const ownerRouter = Router()

ownerRouter.get('/',  findAll)
ownerRouter.get('/:id',validateObjectId('id'),findOne)
ownerRouter.post('/',validateWithSchema(OwnerSchema),sanitizeOwnerInput, add)
ownerRouter.put('/:id',validateObjectId('id'),validateWithSchema(OwnerSchema),sanitizeOwnerInput, update)
ownerRouter.patch('/:id',validateObjectId('id'),validateWithSchema(ParcialOwnerSchema),sanitizeOwnerInput, update)
ownerRouter.delete('/:id',validateObjectId('id'), remove)
ownerRouter.get('/cuit/:cuit',validateCuit('cuit'), getOwnerByCuit);