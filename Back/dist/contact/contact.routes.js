import { Router } from 'express';
import { sanitizeContactInput, findAll, findOne, add, update, remove } from './contact.controler.js';
export const contactRouter = Router();
contactRouter.get('/', findAll);
contactRouter.get('/:id', findOne);
contactRouter.post('/', sanitizeContactInput, add);
contactRouter.put('/:id', sanitizeContactInput, update);
contactRouter.patch('/:id', sanitizeContactInput, update);
contactRouter.delete('/:id', remove);
//# sourceMappingURL=contact.routes.js.map