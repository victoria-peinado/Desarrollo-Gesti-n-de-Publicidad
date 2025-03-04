import { Router } from 'express'
import { sanitizeBlockInput, findAll, findOne, add, update, remove, addAll, removeAll, findOneByNum, findSomeByNums } from './block.controler.js'
import { BlockSchema, NumsList, ParcialBlockSchema } from './block.entity.js'
import { validateWithSchema , validateObjectId} from '../shared/db/middleware.js'
import {  verifyToken,authorizeUserRoles } from '../auth/auth.middleware.js'



export const blockRouter = Router()

blockRouter.get('/blockByNum/:num',verifyToken, authorizeUserRoles('admin'),   findOneByNum) //arregalr el midelware
blockRouter.get('/getManyByNum',verifyToken, authorizeUserRoles('admin'), validateWithSchema(NumsList), sanitizeBlockInput, findSomeByNums)
blockRouter.get('/',verifyToken, authorizeUserRoles('admin'), findAll)
blockRouter.get('/:id',verifyToken, authorizeUserRoles('admin'), validateObjectId('id'), findOne)
blockRouter.post('/all',verifyToken, authorizeUserRoles('admin'), addAll)
blockRouter.post( '/',verifyToken, authorizeUserRoles('admin'), validateWithSchema(BlockSchema), sanitizeBlockInput, add)
blockRouter.put('/:id',verifyToken, authorizeUserRoles('admin'), validateObjectId('id'), validateWithSchema(BlockSchema),sanitizeBlockInput, update)
blockRouter.patch('/:id',verifyToken, authorizeUserRoles('admin'), validateObjectId('id'), validateWithSchema(ParcialBlockSchema), sanitizeBlockInput, update)
blockRouter.delete('/deleteall/',verifyToken, authorizeUserRoles('admin'), removeAll)
blockRouter.delete('/:id',verifyToken, authorizeUserRoles('admin'), validateObjectId('id'), remove)
