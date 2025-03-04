import { Router } from "express";
import { findAll, findOne, add, update, remove,sanitizeOrderInput, findWithRelations, testRenovarOrdenes, cancelOrder, registerPayment, updateSpot, getNotPayOrdersByOwnerCuit, getNotPayOrdersByShop,  } from "./order.controler.js";
import { validateWithSchema , validateObjectId, validateCuit} from '../shared/db/middleware.js'
import { CancelOrderSchema, OrderSchema, PatchOrderSchema, PutOrderSchema, UpdSpotOrderSchema} from './order.entity.js'
import {  verifyToken,authorizeUserRoles } from '../auth/auth.middleware.js'


//const validIdBlock=validateIdExistence(em.getRepository(Block), "block");
export const orderRouter = Router()

orderRouter.get('/populate',verifyToken, authorizeUserRoles('admin'), findWithRelations);
orderRouter.get('/notPayOrdersByOwnerCuit/:cuit',verifyToken, authorizeUserRoles('admin'), getNotPayOrdersByOwnerCuit)
orderRouter.get('/notPayOrdersByShop/:shopId',verifyToken, authorizeUserRoles('admin'), getNotPayOrdersByShop)
orderRouter.get('/',verifyToken, authorizeUserRoles('admin'), findAll);
orderRouter.get('/:id',verifyToken, authorizeUserRoles('admin'), validateObjectId('id'), findOne); // Validate ID for finding an order by ID


orderRouter.post('/renovateOrders',verifyToken, authorizeUserRoles('admin'), testRenovarOrdenes)
orderRouter.post('/',verifyToken, authorizeUserRoles('admin'), validateWithSchema(OrderSchema), sanitizeOrderInput, add); // Validate order schema and sanitize input before adding
//orderRouter.post('/', sanitizeOrderInput, add); // Validate order schema and sanitize input before adding


orderRouter.put('/:id',verifyToken, authorizeUserRoles('admin'),validateWithSchema(PutOrderSchema), validateObjectId('id'),  sanitizeOrderInput, update); // Validate ID and order schema before updating

//orderRouter.patch('/cancelOrder/:id', validateWithSchema(CancelOrderSchema), validateObjectId('id'), sanitizeOrderInput, cancelOrder)
orderRouter.patch('/cancelOrder/:id',verifyToken, authorizeUserRoles('admin'), sanitizeOrderInput, cancelOrder)

// orderRouter.put('/registerPayment/:id',validateWithSchema(PaymentOrderSchema), validateObjectId('id'), sanitizeOrderInput, registerPayment)
orderRouter.patch('/registerPayment/:id',verifyToken, authorizeUserRoles('admin'), sanitizeOrderInput, registerPayment)

//orderRouter.patch('/updateSpot/:id', validateWithSchema(UpdSpotOrderSchema), validateObjectId('id'), sanitizeOrderInput, updateSpot)
orderRouter.patch('/updateSpot/:id',verifyToken, authorizeUserRoles('admin'), sanitizeOrderInput, updateSpot)

orderRouter.patch('/:id',verifyToken, authorizeUserRoles('admin'), validateWithSchema(PatchOrderSchema),validateObjectId('id'),  sanitizeOrderInput, update); // Validate ID and partial order schema before partial update

orderRouter.delete('/:id',verifyToken, authorizeUserRoles('admin'), validateObjectId('id'), remove); // Validate ID before deleting an order