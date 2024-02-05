import { Router } from "express";
import { findAll, findOne, add, update, remove, sanitizeOwnerInput, getOwnerByCuit } from "./owner.controler.js";

export const ownerRouter = Router()

ownerRouter.get('/',sanitizeOwnerInput,  findAll)
ownerRouter.get('/:id',sanitizeOwnerInput, findOne)
ownerRouter.post('/',sanitizeOwnerInput, add)
ownerRouter.put('/:id',sanitizeOwnerInput, update)
ownerRouter.patch('/:id',sanitizeOwnerInput, update)
ownerRouter.delete('/:id', sanitizeOwnerInput, remove)
ownerRouter.get('/cuit/:cuit', getOwnerByCuit);