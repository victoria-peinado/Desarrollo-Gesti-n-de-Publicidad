import { Router } from "express";
import { findAll, findOne, add, update, remove,sanitizeSpotInput, upload, findOneFile,  } from "./spot.controler.js";
import { validateWithSchema , validateObjectId} from '../shared/db/middleware.js'
import { SpotSchema , ParcialSpotSchema} from "./spot.entity.js";
import { multerUploads } from "../shared/audioFunctions.js";
import {  verifyToken,authorizeUserRoles } from '../auth/auth.middleware.js'



export const spotRouter = Router()

spotRouter.get('/',verifyToken, authorizeUserRoles('admin'),  findAll)
spotRouter.get('/:id',verifyToken, authorizeUserRoles('admin'),validateObjectId('id'), findOne)
spotRouter.get('/file/:id',verifyToken, authorizeUserRoles('admin'), validateObjectId('id'), findOneFile)
spotRouter.post('/upload',verifyToken, authorizeUserRoles('admin'), multerUploads.single('audio'), sanitizeSpotInput, upload)
spotRouter.post('/',verifyToken, authorizeUserRoles('admin'),validateWithSchema(SpotSchema ),sanitizeSpotInput, add)
spotRouter.put('/:id',verifyToken, authorizeUserRoles('admin'),validateObjectId('id'),validateWithSchema(SpotSchema ),sanitizeSpotInput, update)
spotRouter.patch('/:id',verifyToken, authorizeUserRoles('admin'),validateObjectId('id'),validateWithSchema(ParcialSpotSchema ),sanitizeSpotInput, update)
spotRouter.delete('/:id',verifyToken, authorizeUserRoles('admin'),validateObjectId('id'),remove)
