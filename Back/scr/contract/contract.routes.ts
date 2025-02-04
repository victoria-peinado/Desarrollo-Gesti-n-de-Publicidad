import { Router } from "express";
import { findAll, findOne, add, update, remove, sanitizeContractInput, getByShop } from "./contract.controler.js";
import { validateWithSchema , validateObjectId, validateCuit, validateIdExistence} from '../shared/db/middleware.js'
import { ContractSchema, PatchContractSchema, PutContractSchema} from './contract.entity.js'
import { orm } from '../shared/db/orm.js'; // for the unique field middleware
import { Shop } from "../shop/shop.entity.js";
import { Block } from "../block/block.entity.js";

const em = orm.em;
const validIdShop=validateIdExistence(em.getRepository(Shop), "shop");

export const contractRouter = Router()

contractRouter.get('/', findAll)
contractRouter.get('/:id', validateObjectId('id'), findOne) // Validate ID for finding a contract by ID
contractRouter.get('/shop/:idShop', validateObjectId('idShop'), getByShop) // Validate shop ID for finding contracts by shop ID
contractRouter.post('/', validateWithSchema(ContractSchema),validIdShop, sanitizeContractInput, add) // Validate contract schema and sanitize input before adding
contractRouter.put('/:id', validateObjectId('id'), validateWithSchema(PutContractSchema),validIdShop, sanitizeContractInput, update) // Validate ID and contract schema before updating
contractRouter.patch('/:id', validateObjectId('id'), validateWithSchema(PatchContractSchema),validIdShop, sanitizeContractInput, update) // Validate ID and partial contract schema before partial update
contractRouter.delete('/:id', validateObjectId('id'), remove) // Validate ID before deleting a contract