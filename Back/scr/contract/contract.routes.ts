import { Router } from "express";
import { findAll, findOne, add, update, remove, sanitizeContractInput, getByShop } from "./contract.controler.js";

export const contractRouter = Router()

contractRouter.get('/',findAll)
contractRouter.get('/:id', findOne)
contractRouter.get('/shop/:idShop',  getByShop)
contractRouter.post('/',sanitizeContractInput, add)
contractRouter.put('/:id', sanitizeContractInput,  update)
contractRouter.patch('/:id', sanitizeContractInput, update)
contractRouter.delete('/:id',  remove)

