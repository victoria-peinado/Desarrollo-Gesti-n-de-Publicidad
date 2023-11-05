import { Router } from 'express'
import { createTrade, getTrades, getTrade } from './trade.controler.js'

export const tradeRouter = Router()

tradeRouter.post('/', createTrade)
tradeRouter.get('/', getTrades)
tradeRouter.get('/:id', getTrade)