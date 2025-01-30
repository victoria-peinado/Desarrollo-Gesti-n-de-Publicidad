import { Router } from "express";
import { findAll, findOne, add, update, remove,sanitizeOrderInput,  } from "./order.controler.js";
import { validateWithSchema , validateObjectId, validateCuit} from '../shared/db/middleware.js'
import { OrderSchema, PatchOrderSchema, PutOrderSchema} from './order.entity.js'
export const orderRouter = Router()

orderRouter.get('/', findAll);
orderRouter.get('/:id', validateObjectId('id'), findOne); // Validate ID for finding an order by ID
orderRouter.post('/', validateWithSchema(OrderSchema), sanitizeOrderInput, add); // Validate order schema and sanitize input before adding
orderRouter.put('/:id', validateObjectId('id'), validateWithSchema(PutOrderSchema), sanitizeOrderInput, update); // Validate ID and order schema before updating
orderRouter.patch('/:id', validateObjectId('id'), validateWithSchema(PatchOrderSchema), sanitizeOrderInput, update); // Validate ID and partial order schema before partial update
orderRouter.delete('/:id', validateObjectId('id'), remove); // Validate ID before deleting an order