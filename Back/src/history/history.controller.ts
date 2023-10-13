import { Request, Response, NextFunction } from 'express';
import { HistoryRepository } from './history.repository.js';
import { History } from './history.entity.js';

const repository = new HistoryRepository();

function sanitizeHistoryInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    startTime: req.body.startTime,
    precio: req.body.precio,
    idBlock: req.body.idBlock,
  };

  // Puedes realizar más validaciones y ajustes aquí según tus necesidades

  next();
}

function findAll(req: Request, res: Response) {
  res.json({ data: repository.findAll() });
}

function findOne(req: Request, res: Response) {
  const id = req.params.id;
  const history = repository.findOne({ id });

  if (!history) {
    return res.status(404).send({ message: 'History not found' });
  }

  res.json({ data: history });
}

function add(req: Request, res: Response) {
  const input = req.body.sanitizedInput;

  const historyInput = new History(
    input.startTime,
    input.precio,
    input.idBlock
  );

  const history = repository.add(historyInput);

  return res.status(201).send({ message: 'History created', data: history });
}

function update(req: Request, res: Response) {
  req.body.sanitizedInput.id = req.params.id;
  const history = repository.update(req.body.sanitizedInput);

  if (!history) {
    return res.status(404).send({ message: 'History not found' });
  }

  return res.status(200).send({ message: 'History updated successfully', data: history });
}

function remove(req: Request, res: Response) {
  const id = req.params.id;
  const history = repository.delete({ id });

  if (!history) {
    return res.status(404).send({ message: 'History not found' });
  } else {
    return res.status(200).send({ message: 'History deleted successfully' });
  }
}

export {
  sanitizeHistoryInput,
  findAll,
  findOne,
  add,
  update,
  remove,
};