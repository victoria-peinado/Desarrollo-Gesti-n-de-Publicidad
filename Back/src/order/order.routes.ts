import { Router } from "express";
import { findAll, findOne, add, update, remove,sanitizeOrderInput, findWithRelations, testRenovarOrdenes, cancelOrder, registerPayment, updateSpot, getNotPayOrdersByOwnerCuit, getNotPayOrdersByShop, findAllNotPayOrders, findNotPayOrdersByDates, findNotPayOrdersByDates2, migrateDatesOrder, findAllNotPayOrdersFilter, getAllOrdersByShop,  } from "./order.controler.js";
import { validateWithSchema , validateObjectId, validateCuit, sanitizeDatesFilterInput} from '../shared/db/middleware.js'
import { CancelOrderSchema, OrderSchema, OrdersIDsSchema, PatchOrderSchema, PutOrderSchema, UpdSpotOrderSchema} from './order.entity.js'
import {  verifyToken,authorizeUserRoles } from '../auth/auth.middleware.js'
import { DaysSchema } from "../shared/db/schemas.js";
import { notifyByMail, sanitizeMailInput } from "../shared/sendMailNotification.js";


//const validIdBlock=validateIdExistence(em.getRepository(Block), "block");
export const orderRouter = Router()

orderRouter.get('/populate',verifyToken, authorizeUserRoles('admin'), findWithRelations);
orderRouter.get('/notPayOrdersByOwnerCuit/:cuit',verifyToken, authorizeUserRoles('admin'), getNotPayOrdersByOwnerCuit)
orderRouter.get('/notPayOrdersByShop/:shopId',verifyToken, authorizeUserRoles('admin'), getNotPayOrdersByShop)
orderRouter.get('/byShopId/:shopId', verifyToken, authorizeUserRoles('admin'), getAllOrdersByShop)


orderRouter.get('/allNotPayOrders', verifyToken, authorizeUserRoles('admin'), findAllNotPayOrders)
orderRouter.get('/dates/notPayOrders', verifyToken, authorizeUserRoles('admin'), validateWithSchema(DaysSchema), sanitizeDatesFilterInput, findNotPayOrdersByDates)

orderRouter.get('/dates/v2/notPayOrders', verifyToken, authorizeUserRoles('admin'),  findNotPayOrdersByDates2)

orderRouter.get('/dates/notPayOrdersFilter', verifyToken, authorizeUserRoles('admin'), findAllNotPayOrdersFilter)


orderRouter.get('/',verifyToken, authorizeUserRoles('admin'), findAll);
orderRouter.get('/:id',verifyToken, authorizeUserRoles('admin'), validateObjectId('id'), findOne); // Validate ID for finding an order by ID


orderRouter.post('/renovateOrders',verifyToken, authorizeUserRoles('admin'), testRenovarOrdenes)

orderRouter.post('/notifyByMail', verifyToken, authorizeUserRoles('admin'), validateWithSchema(OrdersIDsSchema), sanitizeMailInput,notifyByMail)


orderRouter.post('/migrarFechas', migrateDatesOrder)
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