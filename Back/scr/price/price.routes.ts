import { Router } from "express";
import { findAll, findOne, add, update, remove, sanitizePriceInput, addAllPrices } from "./price.controler.js";
import { validateWithSchema , validateObjectId, validateIdExistence} from '../shared/db/middleware.js'
import { PriceSchema, PartialPriceSchema, PriceAllSchema } from './price.entity.js'
import { orm } from '../shared/db/orm.js'; // for the unique field middlewar
import { Block } from "../block/block.entity.js";
const em = orm.em;
const validId= validateIdExistence(em.getRepository(Block), "block");
export const priceRouter = Router()

priceRouter.get('/', findAll)
priceRouter.get('/:id',validateObjectId('id'), findOne)
priceRouter.post('/',validateWithSchema(PriceSchema),validId, sanitizePriceInput, add)
priceRouter.post('/all/',validateWithSchema(PriceAllSchema),validId, sanitizePriceInput, addAllPrices)
priceRouter.put('/:id',validateObjectId('id'),validateWithSchema(PriceSchema),validId, sanitizePriceInput, update)
priceRouter.patch('/:id',validateObjectId('id'),validateWithSchema(PartialPriceSchema),validId, sanitizePriceInput, update)
priceRouter.delete('/:id',validateObjectId('id'),  remove)
