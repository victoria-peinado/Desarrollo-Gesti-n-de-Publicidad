import { Router } from 'express';
import { createBillingHolder, getBillingHolders, getBillingHolder, getBillingHolderByCUIT } from './billing_holder.controler.js';
export const billingHolerRouter = Router();
billingHolerRouter.post('/', createBillingHolder);
billingHolerRouter.get('/', getBillingHolders);
billingHolerRouter.get('/:id', getBillingHolder);
billingHolerRouter.get('/cuit/:cuit', getBillingHolderByCUIT);
//# sourceMappingURL=billing_holder.routes.js.map