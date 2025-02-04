import { Router } from "express";
import { findAll, findOne, add, update, remove, sanitizeContactInput  } from "./contact.controler.js";
import { validateWithSchema , validateObjectId,validateUniqueField} from '../shared/db/middleware.js'
import { ContactSchema, ParcialContactSchema } from "./contact.entity.js";
import { orm } from '../shared/db/orm.js'; // for the unique field middleware
import { Contact } from "./contact.entity.js";


const em = orm.em;
const unique= validateUniqueField(em.getRepository(Contact), "dni");

export const contactRouter = Router()

contactRouter.get('/', findAll)
contactRouter.get('/:id',validateObjectId('id'), findOne)
contactRouter.post('/',validateWithSchema(ContactSchema),unique ,sanitizeContactInput, add)
contactRouter.put('/:id',validateObjectId('id'),validateWithSchema(ContactSchema) ,unique, sanitizeContactInput, update)
contactRouter.patch('/:id',validateObjectId('id'),validateWithSchema(ParcialContactSchema) ,unique, sanitizeContactInput, update)
contactRouter.delete('/:id',validateObjectId('id'), remove)


