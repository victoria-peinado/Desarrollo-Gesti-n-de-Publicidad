import { Router } from "express";
import { findAll, findOne, add, update, remove,sanitizeSpotInput,  } from "./spot.controler.js";

export const spotRouter = Router()

spotRouter.get('/',  findAll)
spotRouter.get('/:id', findOne)
spotRouter.post('/',sanitizeSpotInput, add)
spotRouter.put('/:id',sanitizeSpotInput, update)
spotRouter.patch('/:id',sanitizeSpotInput, update)
spotRouter.delete('/:id',remove)
