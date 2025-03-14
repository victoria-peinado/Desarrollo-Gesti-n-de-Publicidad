import { Router } from 'express'
import {findAll, findByDates, findOne, sanitizeBBDD, sanitizeDOBInput} from '../day_order_block/day_order_block.controler.js'
import { validateWithSchema, validateObjectId, sanitizeDatesFilterInput } from '../shared/db/middleware.js'
import { verifyToken, authorizeUserRoles } from '../auth/auth.middleware.js'
import { DaysSchema } from "../shared/db/schemas.js";


export const dobRouter = Router()

dobRouter.delete('/limpiarBBDD', verifyToken, authorizeUserRoles('admin'), sanitizeBBDD)


dobRouter.get('/', verifyToken, authorizeUserRoles('admin'), findAll)
//dobRouter.get('/dates', verifyToken, authorizeUserRoles('admin'), validateWithSchema(DaysSchema), sanitizeDatesFilterInput, findByDates)
dobRouter.get('/dates', verifyToken, authorizeUserRoles('admin'), findByDates)
dobRouter.get('/:id', verifyToken, authorizeUserRoles('admin'), validateObjectId('id'), findOne)

