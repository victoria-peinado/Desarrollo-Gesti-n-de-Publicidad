import { Router } from "express";
import { findAll, findOne, add, update, remove,sanitizeOrderInput, findWithRelations, testRenovarOrdenes, cancelOrder, registerPayment, updateSpot,  } from "./order.controler.js";
import { validateWithSchema , validateObjectId, validateCuit,validateIdExistence} from '../shared/db/middleware.js'
import { CancelOrderSchema, OrderSchema, PatchOrderSchema, PutOrderSchema, UpdSpotOrderSchema} from './order.entity.js'
import { orm } from '../shared/db/orm.js'; // for the unique field middleware
import { Contract } from "../contract/contract.entity.js";
import { Spot } from "../spot/spot.entity.js";
//import { Block } from "../block/block.entity.js";
const em = orm.em;

const validIdSpot=validateIdExistence(em.getRepository(Spot), "spot");
const validIdContrac=validateIdExistence(em.getRepository(Contract), "contract");
//const validIdBlock=validateIdExistence(em.getRepository(Block), "block");
export const orderRouter = Router()

orderRouter.get('/populate', findWithRelations);
orderRouter.get('/', findAll);
orderRouter.get('/:id', validateObjectId('id'), findOne); // Validate ID for finding an order by ID


orderRouter.post('/renovateOrders', testRenovarOrdenes)
orderRouter.post('/', validateWithSchema(OrderSchema),validIdSpot, validIdContrac, sanitizeOrderInput, add); // Validate order schema and sanitize input before adding
//orderRouter.post('/', sanitizeOrderInput, add); // Validate order schema and sanitize input before adding


orderRouter.put('/:id',validateWithSchema(PutOrderSchema), validateObjectId('id'),  validIdSpot, sanitizeOrderInput, update); // Validate ID and order schema before updating

//orderRouter.patch('/cancelOrder/:id', validateWithSchema(CancelOrderSchema), validateObjectId('id'), sanitizeOrderInput, cancelOrder)
orderRouter.patch('/cancelOrder/:id', sanitizeOrderInput, cancelOrder)

// orderRouter.put('/registerPayment/:id',validateWithSchema(PaymentOrderSchema), validateObjectId('id'), sanitizeOrderInput, registerPayment)
orderRouter.patch('/registerPayment/:id', sanitizeOrderInput, registerPayment)

//orderRouter.patch('/updateSpot/:id', validateWithSchema(UpdSpotOrderSchema), validateObjectId('id'), sanitizeOrderInput, updateSpot)
orderRouter.patch('/updateSpot/:id', sanitizeOrderInput, updateSpot)

orderRouter.patch('/:id', validateWithSchema(PatchOrderSchema),validateObjectId('id'), validIdSpot,  sanitizeOrderInput, update); // Validate ID and partial order schema before partial update

orderRouter.delete('/:id', validateObjectId('id'), remove); // Validate ID before deleting an order