import { Router } from 'express';
import { createTrade, getTrades, getTrade, getTradesByBillingHolderId } from './trade.controler.js';
export const tradeRouter = Router();
tradeRouter.post('/', createTrade);
tradeRouter.get('/', getTrades);
tradeRouter.get('/:id', getTrade);
tradeRouter.get('/billingHolderId/:billingHolderId', getTradesByBillingHolderId);
//# sourceMappingURL=trade.routes.js.map