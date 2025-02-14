import { Router } from "express";
import { findAll, findOne, add, update, remove, sanitizeOwnerInput, getOwnerByCuit } from "./owner.controler.js";
import { OwnerSchema,ParcialOwnerSchema } from './owner.entity.js'
import { validateWithSchema , validateObjectId, validateCuit,validateUniqueField} from '../shared/db/middleware.js'
import { orm } from '../shared/db/orm.js'; // for the unique field middleware
import { Owner } from "./owner.entity.js";


const em = orm.em;
const unique= validateUniqueField(em.getRepository(Owner), "cuit");

export const ownerRouter = Router()

ownerRouter.get('/',  findAll)
ownerRouter.get('/:id',validateObjectId('id'),findOne)
ownerRouter.post('/',validateWithSchema(OwnerSchema),unique,sanitizeOwnerInput, add)
ownerRouter.put('/:id',validateObjectId('id'),validateWithSchema(OwnerSchema),unique,sanitizeOwnerInput, update)
ownerRouter.patch('/:id',validateObjectId('id'),validateWithSchema(ParcialOwnerSchema),unique,sanitizeOwnerInput, update)
ownerRouter.delete('/:id',validateObjectId('id'), remove)
ownerRouter.get('/cuit/:cuit',validateCuit('cuit'), getOwnerByCuit);