import { Router } from "express";
import { findAll, findOne, add, update, remove, sanitizeShopInput, getShopsByOwnerId, getShopsByCuitAndFantasyName, getShopsByCuit } from "./shop.controler.js";
import { ShopSchema, PartialShopSchema, ShopPutSchema} from './shop.entity.js'
import { validateWithSchema , validateObjectId, validateCuit,validateIdExistence} from '../shared/db/middleware.js'
import { orm } from '../shared/db/orm.js'; // for the unique field middlewar
import { Owner } from "../owner/owner.entity.js";
import { Contact } from "../contact/contact.entity.js";
const em = orm.em;
const validIdOwner=validateIdExistence(em.getRepository(Owner), "owner");
const validIdContact=validateIdExistence(em.getRepository(Contact), "contact");

export const shopRouter = Router()
shopRouter.get('/search', getShopsByCuitAndFantasyName);
shopRouter.get('/owner/:ownerId', validateObjectId('ownerId'), getShopsByOwnerId);
shopRouter.get('/:cuit(\\d{11})', validateCuit('cuit'), getShopsByCuit);
shopRouter.get('/:id([a-zA-Z0-9-]+)', validateObjectId('id'), findOne);
shopRouter.get('/', findAll);
shopRouter.post('/', validateWithSchema(ShopSchema),validIdOwner,validIdContact, sanitizeShopInput, add);
shopRouter.put('/:id', validateObjectId('id'), validateWithSchema(ShopPutSchema),validIdOwner,validIdContact, sanitizeShopInput, update);
shopRouter.patch('/:id', validateObjectId('id'), validateWithSchema(PartialShopSchema), validIdOwner,validIdContact,sanitizeShopInput, update);
shopRouter.delete('/:id', validateObjectId('id'), remove)
