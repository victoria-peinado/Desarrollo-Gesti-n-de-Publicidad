import { Request, Response, NextFunction } from 'express'
import { AdvertisingSpotRepository } from './advertisingSpot.repository.js'
import { AdvertisingSpot } from './advertisingSpot.entity.js'

const repository = new AdvertisingSpotRepository()

function sanitizeAdvertisingSpotInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    name: req.body.name,
    duration: req.body.duration
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
  const advertisingSpot = repository.findOne({ id })
  if (!advertisingSpot) {
    return res.status(404).send({ message: 'AdvertisingSpotnot found' })
  }
  res.json({ data: advertisingSpot })
}

function add(req: Request, res: Response) {
  const input = req.body.sanitizedInput

  const advertisingSpotInput = new AdvertisingSpot(
    input.name,
    input.duration
  )

  const advertisingSpot = repository.add(advertisingSpotInput)
  return res.status(201).send({ message: 'AdvertisingSpot created', data: advertisingSpot })
}

function update(req: Request, res: Response) {
  req.body.sanitizedInput.id = req.params.id
  const advertisingSpot = repository.update(req.body.sanitizedInput)

  if (!advertisingSpot) {
    return res.status(404).send({ message: 'AdvertisingSpot not found' })
  }

  return res.status(200).send({ message: 'AdvertisingSpot updated successfully', data: advertisingSpot })
}

function remove(req: Request, res: Response) {
  const id = req.params.id
  const advertisingSpot = repository.delete({ id })

  if (!advertisingSpot) {
    res.status(404).send({ message: 'AdvertisingSpot not found' })
  } else {
    res.status(200).send({ message: 'AdvertisingSpot deleted successfully' })
  }
}

export { sanitizeAdvertisingSpotInput, findAll, findOne, add, update, remove }
