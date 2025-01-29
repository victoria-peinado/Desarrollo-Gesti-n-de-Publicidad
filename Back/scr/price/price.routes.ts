import { Router } from "express";
import { findAll, findOne, add, update, remove, sanitizePriceInput, addAllPrices } from "./price.controler.js";
import { validateWithSchema , validateObjectId} from '../shared/db/middleware.js'
import { PriceSchema, PartialPriceSchema, PriceAllSchema } from './price.entity.js'
export const priceRouter = Router()

priceRouter.get('/', findAll)
priceRouter.get('/:id',validateObjectId('id'), findOne)
priceRouter.post('/',validateWithSchema(PriceSchema), sanitizePriceInput, add)
priceRouter.post('/all/',validateWithSchema(PriceAllSchema), sanitizePriceInput, addAllPrices)
priceRouter.put('/:id',validateObjectId('id'),validateWithSchema(PriceSchema), sanitizePriceInput, update)
priceRouter.patch('/:id',validateObjectId('id'),validateWithSchema(PartialPriceSchema), sanitizePriceInput, update)
priceRouter.delete('/:id',validateObjectId('id'),  remove)