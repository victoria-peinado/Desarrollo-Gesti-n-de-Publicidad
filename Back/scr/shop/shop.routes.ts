import { Router } from "express";
import { findAll, findOne, add, update, remove, sanitizeShopInput, getShopsByOwnerId, getShopsByCuitAndFantasyName, getShopsByCuit } from "./shop.controler.js";

export const shopRouter = Router()

shopRouter.get('/search', getShopsByCuitAndFantasyName);
shopRouter.get('/owner/:ownerId', getShopsByOwnerId); 
shopRouter.get('/:cuit(\\d{11})', getShopsByCuit); // CUIT: exactamente 11  dígitos
shopRouter.get('/:id([a-zA-Z0-9-]+)',  findOne); // ID: UUID o alfanumérico  
shopRouter.get('/', findAll);
shopRouter.post('/', sanitizeShopInput, add)     
shopRouter.get('/owner/:ownerId', getShopsByOwnerId)
shopRouter.put('/:id', sanitizeShopInput, update)
shopRouter.patch('/:id', sanitizeShopInput, update)
shopRouter.delete('/:id',  remove)
