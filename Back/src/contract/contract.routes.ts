import { Router } from "express";
import { findAll, findOne, add, update, remove, sanitizeContractInput, getContractsByShopId } from "./contract.controler.js";
import { validateWithSchema , validateObjectId} from '../shared/db/middleware.js'
import { ContractSchema, PatchContractSchema, PutContractSchema} from './contract.entity.js'
import {  verifyToken,authorizeUserRoles } from '../auth/auth.middleware.js'

export const contractRouter = Router()

contractRouter.get('/',verifyToken, authorizeUserRoles('admin'), findAll)
contractRouter.get('/:id',verifyToken, authorizeUserRoles('admin'), validateObjectId('id'), findOne) // Validate ID for finding a contract by ID
contractRouter.get('/shop/:idShop',verifyToken, authorizeUserRoles('admin'), validateObjectId('idShop'), getContractsByShopId) // Validate shop ID for finding contracts by shop ID
contractRouter.post('/',verifyToken, authorizeUserRoles('admin'), validateWithSchema(ContractSchema), sanitizeContractInput, add) // Validate contract schema and sanitize input before adding
contractRouter.put('/:id',verifyToken, authorizeUserRoles('admin'), validateObjectId('id'), validateWithSchema(PutContractSchema), sanitizeContractInput, update) // Validate ID and contract schema before updating
contractRouter.patch('/:id',verifyToken, authorizeUserRoles('admin'), validateObjectId('id'), validateWithSchema(PatchContractSchema), sanitizeContractInput, update) // Validate ID and partial contract schema before partial update
contractRouter.delete('/:id',verifyToken, authorizeUserRoles('admin'), validateObjectId('id'), remove) // Validate ID before deleting a contract