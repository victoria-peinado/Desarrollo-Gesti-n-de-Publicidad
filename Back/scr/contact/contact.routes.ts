import { Router } from "express";
import { findAll, findOne, add, update, remove, sanitizeContactInput  } from "./contact.controler.js";

export const contactRouter = Router()

contactRouter.get('/', findAll)
contactRouter.get('/:id', findOne)
contactRouter.post('/', sanitizeContactInput, add)
contactRouter.put('/:id', sanitizeContactInput, update)
contactRouter.patch('/:id', sanitizeContactInput, update)
contactRouter.delete('/:id', remove)


