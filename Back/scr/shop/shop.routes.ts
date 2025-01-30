import { Router } from "express";
import { findAll, findOne, add, update, remove, sanitizeShopInput, getShopsByOwnerId, getShopsByCuitAndFantasyName, getShopsByCuit } from "./shop.controler.js";
import { ShopSchema, PartialShopSchema, ShopPutSchema} from './shop.entity.js'
import { validateWithSchema , validateObjectId, validateCuit} from '../shared/db/middleware.js'
export const shopRouter = Router()
shopRouter.get('/search', getShopsByCuitAndFantasyName);
shopRouter.get('/owner/:ownerId', validateObjectId('ownerId'), getShopsByOwnerId);
shopRouter.get('/:cuit(\\d{11})', validateCuit('cuit'), getShopsByCuit);
shopRouter.get('/:id([a-zA-Z0-9-]+)', validateObjectId('id'), findOne);
shopRouter.get('/', findAll);
shopRouter.post('/', validateWithSchema(ShopSchema), sanitizeShopInput, add);
shopRouter.put('/:id', validateObjectId('id'), validateWithSchema(ShopPutSchema), sanitizeShopInput, update);
shopRouter.patch('/:id', validateObjectId('id'), validateWithSchema(PartialShopSchema), sanitizeShopInput, update);
shopRouter.delete('/:id', validateObjectId('id'), remove)
