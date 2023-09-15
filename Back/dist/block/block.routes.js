import { Router } from 'express';
import { sanitizeBlockInput, findAll, findOne, add, update, remove } from './block.controler.js';
export const blockRouter = Router();
blockRouter.get('/', findAll);
blockRouter.get('/:id', findOne);
blockRouter.post('/', sanitizeBlockInput, add);
blockRouter.put('/:id', sanitizeBlockInput, update);
blockRouter.patch('/:id', sanitizeBlockInput, update);
blockRouter.delete('/:id', remove);
//# sourceMappingURL=block.routes.js.map