import { Router } from "express";
import { findAll, findOne, add, update, remove, sanitizeOwnerInput, getOwnerByCuit } from "./owner.controler.js";

export const ownerRouter = Router()

ownerRouter.get('/',  findAll)
ownerRouter.get('/:id',findOne)
ownerRouter.post('/',sanitizeOwnerInput, add)
ownerRouter.put('/:id',sanitizeOwnerInput, update)
ownerRouter.patch('/:id',sanitizeOwnerInput, update)
ownerRouter.delete('/:id', remove)
ownerRouter.get('/cuit/:cuit', getOwnerByCuit);