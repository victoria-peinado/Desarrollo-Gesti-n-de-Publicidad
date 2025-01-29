import { Router } from 'express'
import { sanitizeBlockInput, findAll, findOne, add, update, remove, addAll, removeAll } from './block.controler.js'
import { BlockSchema, ParcialBlockSchema } from './block.entity.js'
import { validateWithSchema , validateObjectId} from '../shared/db/middleware.js'

export const blockRouter = Router()

// Get all blocks
blockRouter.get('/', findAll)

// Get a block by ID, validating the ObjectId
blockRouter.get('/:id', validateObjectId('id'), findOne)

// Create multiple blocks
blockRouter.post(
  '/all',
    addAll  // Controller to add all blocks
)

// Create a single block
blockRouter.post(
  '/',
  validateWithSchema(BlockSchema),  // Validate schema for creating a block
  sanitizeBlockInput,  // Sanitize input data
  add  // Controller to add the block
)

// Update a block by ID
blockRouter.put(
  '/:id',
  validateObjectId('id'),  // Validate ObjectId
  validateWithSchema(BlockSchema),  // Validate schema for updating the block
  sanitizeBlockInput,  // Sanitize input data
  update  // Controller to update the block
)

// Partially update a block by ID
blockRouter.patch(
  '/:id',
  validateObjectId('id'),  // Validate ObjectId
  validateWithSchema(ParcialBlockSchema),  // Validate schema for partial update
  sanitizeBlockInput,  // Sanitize input data
  update  // Controller to update the block
)

// Delete all blocks
blockRouter.delete('/deleteall/', removeAll)

// Delete a block by ID
blockRouter.delete(
  '/:id',
  validateObjectId('id'),  // Validate ObjectId
  remove  // Controller to delete the block
)