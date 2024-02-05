import { Router } from "express";
import { findAll, findOne, add, update, remove, sanitizeContractInput, getByShop } from "./contract.controler.js";

export const contractRouter = Router()

contractRouter.get('/',sanitizeContractInput, findAll)
contractRouter.get('/:id',sanitizeContractInput, findOne)
contractRouter.get('/shop/:idShop', sanitizeContractInput, getByShop)
contractRouter.post('/',sanitizeContractInput, add)
contractRouter.put('/:id', sanitizeContractInput,  update)
contractRouter.patch('/:id', sanitizeContractInput, update)
contractRouter.delete('/:id', sanitizeContractInput, remove)

