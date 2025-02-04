import { Router } from "express";
import { findAll, findOne, add, update, remove,sanitizeSpotInput,  } from "./spot.controler.js";
import { validateWithSchema , validateObjectId} from '../shared/db/middleware.js'
import { SpotSchema , ParcialSpotSchema} from "./spot.entity.js";



export const spotRouter = Router()

spotRouter.get('/',  findAll)
spotRouter.get('/:id',validateObjectId('id'), findOne)
spotRouter.post('/',validateWithSchema(SpotSchema ),sanitizeSpotInput, add)
spotRouter.put('/:id',validateObjectId('id'),validateWithSchema(SpotSchema ),sanitizeSpotInput, update)
spotRouter.patch('/:id',validateObjectId('id'),validateWithSchema(ParcialSpotSchema ),sanitizeSpotInput, update)
spotRouter.delete('/:id',validateObjectId('id'),remove)
