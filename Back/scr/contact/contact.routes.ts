import { Router } from "express";
import { findAll, findOne, add, update, remove, sanitizeContactInput  } from "./contact.controler.js";
import { validateWithSchema , validateObjectId} from '../shared/db/middleware.js'
import { ContactSchema, ParcialContactSchema } from "./contact.entity.js";

export const contactRouter = Router()

contactRouter.get('/', findAll)
contactRouter.get('/:id',validateObjectId('id'), findOne)
contactRouter.post('/',validateWithSchema(ContactSchema) ,sanitizeContactInput, add)
contactRouter.put('/:id',validateObjectId('id'),validateWithSchema(ContactSchema) , sanitizeContactInput, update)
contactRouter.patch('/:id',validateObjectId('id'),validateWithSchema(ParcialContactSchema) , sanitizeContactInput, update)
contactRouter.delete('/:id',validateObjectId('id'), remove)


