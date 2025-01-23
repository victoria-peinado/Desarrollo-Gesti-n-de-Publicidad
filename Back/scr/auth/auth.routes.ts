import { Router } from 'express'
import { sanitizeAuthInput, findAll, findOne, add, update, remove,login, logout,verifyToken} from './auth.controler.js'

export const authRouter = Router()

authRouter.post('/login', login)
authRouter.post('/logout',verifyToken, logout)
authRouter.post('/register',sanitizeAuthInput, add)
authRouter.get('/', findAll)  
authRouter.get('/:id', findOne) 
authRouter.put('/:id', update)
authRouter.delete('/:id', remove)



