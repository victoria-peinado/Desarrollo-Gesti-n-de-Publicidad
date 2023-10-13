import { Router } from 'express';
import { sanitizeHistoryInput, findAll, findOne, add, update, remove } from './history.controller.js';
export const historyRouter = Router();
historyRouter.get('/', findAll);
historyRouter.get('/:id', findOne);
historyRouter.post('/', sanitizeHistoryInput, add);
historyRouter.put('/:id', sanitizeHistoryInput, update);
historyRouter.patch('/:id', sanitizeHistoryInput, update);
historyRouter.delete('/:id', remove);
//# sourceMappingURL=history.routes.js.map