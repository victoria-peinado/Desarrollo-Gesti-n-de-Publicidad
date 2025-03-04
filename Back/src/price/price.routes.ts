import { Router } from "express";
import { findAll, findOne, add, update, remove, sanitizePriceInput, addAllPrices } from "./price.controler.js";
import { validateWithSchema , validateObjectId} from '../shared/db/middleware.js'
import { PriceSchema, PartialPriceSchema, PriceAllSchema } from './price.entity.js'
import {  verifyToken,authorizeUserRoles } from '../auth/auth.middleware.js'

export const priceRouter = Router()

priceRouter.get('/',verifyToken, authorizeUserRoles('admin'), findAll)
priceRouter.get('/:id',verifyToken, authorizeUserRoles('admin'),validateObjectId('id'), findOne)
priceRouter.post('/',verifyToken, authorizeUserRoles('admin'),validateWithSchema(PriceSchema), sanitizePriceInput, add)
priceRouter.post('/all/',verifyToken, authorizeUserRoles('admin'),validateWithSchema(PriceAllSchema), sanitizePriceInput, addAllPrices)
priceRouter.put('/:id',verifyToken, authorizeUserRoles('admin'),validateObjectId('id'),validateWithSchema(PriceSchema), sanitizePriceInput, update)
priceRouter.patch('/:id',verifyToken, authorizeUserRoles('admin'),validateObjectId('id'),validateWithSchema(PartialPriceSchema), sanitizePriceInput, update)
priceRouter.delete('/:id',verifyToken, authorizeUserRoles('admin'),validateObjectId('id'),  remove)
