import { Router } from "express";
import { findAll, findOne, add, update, remove, sanitizeShopInput, getShopsByOwnerId, getShopsByCuitAndFantasyName, getShopsByCuit } from "./shop.controler.js";

export const shopRouter = Router()

shopRouter.get('/search', getShopsByCuitAndFantasyName);
shopRouter.get('/', sanitizeShopInput, findAll)
shopRouter.post('/', sanitizeShopInput, add)
shopRouter.get('/:cuit', getShopsByCuit);
shopRouter.get('/:id', sanitizeShopInput, findOne)
shopRouter.get('/owner/:ownerId', getShopsByOwnerId)
shopRouter.put('/:id', sanitizeShopInput, update)
shopRouter.patch('/:id', sanitizeShopInput, update)
shopRouter.delete('/:id', sanitizeShopInput, remove)
