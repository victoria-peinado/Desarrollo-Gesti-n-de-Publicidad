import { Router } from "express";
import { findAll, findOne, add, update, remove, sanitizePriceInput, addAllPrices } from "./price.controler.js";
import { validateWithSchema , validateObjectId, validateIdExistence} from '../shared/db/middleware.js'
import { PriceSchema, PartialPriceSchema, PriceAllSchema } from './price.entity.js'
import { orm } from '../shared/db/orm.js'; // for the unique field middlewar
import { Block } from "../block/block.entity.js";
const em = orm.em;
export const priceRouter = Router()

priceRouter.get('/', findAll)
priceRouter.get('/:id',validateObjectId('id'), findOne)
priceRouter.post('/',validateWithSchema(PriceSchema),validateIdExistence(em.getRepository(Block), "block"), sanitizePriceInput, add)
priceRouter.post('/all/',validateWithSchema(PriceAllSchema), sanitizePriceInput, addAllPrices)
priceRouter.put('/:id',validateObjectId('id'),validateWithSchema(PriceSchema), sanitizePriceInput, update)
priceRouter.patch('/:id',validateObjectId('id'),validateWithSchema(PartialPriceSchema), sanitizePriceInput, update)
priceRouter.delete('/:id',validateObjectId('id'),  remove)
