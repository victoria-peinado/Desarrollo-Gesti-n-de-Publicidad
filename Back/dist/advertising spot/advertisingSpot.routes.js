import { Router } from 'express';
import { sanitizeAdvertisingSpotInput, findAll, findOne, add, update, remove } from './advertisingSpot.controler.js';
export const advertisingSpotRouter = Router();
advertisingSpotRouter.get('/', findAll);
advertisingSpotRouter.get('/:id', findOne);
advertisingSpotRouter.post('/', sanitizeAdvertisingSpotInput, add);
advertisingSpotRouter.put('/:id', sanitizeAdvertisingSpotInput, update);
advertisingSpotRouter.patch('/:id', sanitizeAdvertisingSpotInput, update);
advertisingSpotRouter.delete('/:id', remove);
//# sourceMappingURL=advertisingSpot.routes.js.map