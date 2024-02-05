import { Router } from "express";
import { findAll, findOne, add, update, remove, sanitizePriceInput, addAllPrices } from "./price.controler.js";

export const priceRouter = Router()

priceRouter.get('/', findAll)
priceRouter.get('/:id',sanitizePriceInput, findOne)
priceRouter.post('/',sanitizePriceInput, add)
priceRouter.post('/all/', sanitizePriceInput, addAllPrices)
priceRouter.put('/:id',sanitizePriceInput, update)
priceRouter.patch('/:id',sanitizePriceInput, update)
priceRouter.delete('/:id', sanitizePriceInput, remove)