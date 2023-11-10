import { Router } from 'express'
import { createTrade, getTrades, getTrade, getTradesByBillingHolderId, getTradesByFantasyNameAndCUIT } from './trade.controler.js'

export const tradeRouter = Router()

tradeRouter.post('/', createTrade);
tradeRouter.get('/search', getTradesByFantasyNameAndCUIT);
tradeRouter.get('/', getTrades);
tradeRouter.get('/:id', getTrade);
tradeRouter.get('/billingHolderId/:billingHolderId', getTradesByBillingHolderId);