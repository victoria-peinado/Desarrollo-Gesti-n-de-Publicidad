import { Request, Response, NextFunction } from 'express'
import { BlockRepository } from './block.repository.js'
import { Block } from './block.entity.js'

const repository = new BlockRepository()

function sanitizeBlockInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    name: req.body.name,
    startTime: req.body.startTime
  }
  //more checks here

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })
  next()
}

function findAll(req: Request, res: Response) {
  res.json({ data: repository.findAll() })
}

function findOne(req: Request, res: Response) {
  const id = req.params.id
  const block = repository.findOne({ id })
  if (!block) {
    return res.status(404).send({ message: 'Block not found' })
  }
  res.json({ data: block })
}

function add(req: Request, res: Response) {
  const input = req.body.sanitizedInput

  const blockInput = new Block(
    input.startTime,
    input.number
  )

  const block = repository.add(blockInput)
  return res.status(201).send({ message: 'Block created', data: block })
}

function update(req: Request, res: Response) {
  req.body.sanitizedInput.id = req.params.id
  const block = repository.update(req.body.sanitizedInput)

  if (!block) {
    return res.status(404).send({ message: 'Block not found' })
  }

  return res.status(200).send({ message: 'Block updated successfully', data: block })
}

function remove(req: Request, res: Response) {
  const id = req.params.id
  const block = repository.delete({ id })

  if (!block) {
    res.status(404).send({ message: 'Block not found' })
  } else {
    res.status(200).send({ message: 'Block deleted successfully' })
  }
}

export { sanitizeBlockInput, findAll, findOne, add, update, remove }
