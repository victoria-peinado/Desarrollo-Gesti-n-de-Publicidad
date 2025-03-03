import { Router } from 'express'
import { sanitizeBlockInput, findAll, findOne, add, update, remove, addAll, removeAll, findOneByNum, findSomeByNums } from './block.controler.js'
import { BlockSchema, NumsList, ParcialBlockSchema } from './block.entity.js'
import { validateWithSchema , validateObjectId} from '../shared/db/middleware.js'
import { orm } from '../shared/db/orm.js'; // for the unique field middleware
import { Block } from './block.entity.js'
import { NumBlockSchema } from '../shared/db/schemas.js';



export const blockRouter = Router()

blockRouter.get('/blockByNum/:num',  findOneByNum) //arregalr el midelware
blockRouter.get('/getManyByNum', validateWithSchema(NumsList), sanitizeBlockInput, findSomeByNums)
blockRouter.get('/', findAll)
blockRouter.get('/:id', validateObjectId('id'), findOne)
blockRouter.post('/all', addAll)
blockRouter.post( '/', validateWithSchema(BlockSchema), sanitizeBlockInput, add)
blockRouter.put('/:id', validateObjectId('id'), validateWithSchema(BlockSchema),sanitizeBlockInput, update)
blockRouter.patch('/:id', validateObjectId('id'), validateWithSchema(ParcialBlockSchema), sanitizeBlockInput, update)
blockRouter.delete('/deleteall/', removeAll)
blockRouter.delete('/:id', validateObjectId('id'), remove)
