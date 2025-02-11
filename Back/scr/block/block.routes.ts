import { Router } from 'express'
import { sanitizeBlockInput, findAll, findOne, add, update, remove, addAll, removeAll } from './block.controler.js'
import { BlockSchema, ParcialBlockSchema } from './block.entity.js'
import { validateWithSchema , validateObjectId,validateUniqueField} from '../shared/db/middleware.js'
import { orm } from '../shared/db/orm.js'; // for the unique field middleware
import { Block } from './block.entity.js'


const em = orm.em;
const unique= validateUniqueField(em.getRepository(Block), "nroBlock");

export const blockRouter = Router()

blockRouter.get('/', findAll)
blockRouter.get('/:id', validateObjectId('id'), findOne)
blockRouter.post('/all', addAll)
blockRouter.post( '/', validateWithSchema(BlockSchema), sanitizeBlockInput, unique, add)
blockRouter.put('/:id', validateObjectId('id'), validateWithSchema(BlockSchema),unique, sanitizeBlockInput, update)
blockRouter.patch('/:id', validateObjectId('id'), validateWithSchema(ParcialBlockSchema), unique, sanitizeBlockInput, update)
blockRouter.delete('/deleteall/', removeAll)
blockRouter.delete('/:id', validateObjectId('id'), remove)
