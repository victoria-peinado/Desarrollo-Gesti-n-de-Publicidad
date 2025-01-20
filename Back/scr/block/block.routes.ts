import { Router } from 'express'
import { sanitizeBlockInput, findAll, findOne, add, update, remove, addAll, removeAll } from './block.controler.js'

export const blockRouter = Router()

blockRouter.get('/', sanitizeBlockInput, findAll)
blockRouter.get('/:id', sanitizeBlockInput, findOne)
blockRouter.post('/all', sanitizeBlockInput, addAll) // CREA TODOS LOS BLOQUES
blockRouter.post('/', sanitizeBlockInput, add)//cera uno solo
blockRouter.put('/:id', sanitizeBlockInput, update) // Agrega el middleware a la ruta PUT
blockRouter.patch('/:id', sanitizeBlockInput, update)
blockRouter.delete('/deleteall/', removeAll) // BORRA TODOS LOS BLOQUES
blockRouter.delete('/:id', remove)

