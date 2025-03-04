import { Router } from "express";
import { findAll, findOne, add, update, remove, sanitizeShopInput, getShopsByOwnerId, getShopsByCuitAndFantasyName, getShopsByCuit } from "./shop.controler.js";
import { ShopSchema, PartialShopSchema, ShopPutSchema} from './shop.entity.js'
import { validateWithSchema , validateObjectId, validateCuit} from '../shared/db/middleware.js'
import {  verifyToken,authorizeUserRoles } from '../auth/auth.middleware.js'

export const shopRouter = Router()
shopRouter.get('/search',verifyToken, authorizeUserRoles('admin'), getShopsByCuitAndFantasyName);
shopRouter.get('/owner/:ownerId',verifyToken, authorizeUserRoles('admin'), validateObjectId('ownerId'), getShopsByOwnerId);
shopRouter.get('/:cuit(\\d{11})',verifyToken, authorizeUserRoles('admin'), validateCuit('cuit'), getShopsByCuit);
shopRouter.get('/:id([a-zA-Z0-9-]+)',verifyToken, authorizeUserRoles('admin'), validateObjectId('id'), findOne);
shopRouter.get('/',verifyToken, authorizeUserRoles('admin'), findAll);
shopRouter.post('/',verifyToken, authorizeUserRoles('admin'), validateWithSchema(ShopSchema),sanitizeShopInput, add);
shopRouter.put('/:id',verifyToken, authorizeUserRoles('admin'), validateObjectId('id'), validateWithSchema(ShopPutSchema),sanitizeShopInput, update);
shopRouter.patch('/:id',verifyToken, authorizeUserRoles('admin'), validateObjectId('id'), validateWithSchema(PartialShopSchema),sanitizeShopInput, update);
shopRouter.delete('/:id',verifyToken, authorizeUserRoles('admin'), validateObjectId('id'), remove)
