import { HistoryRepository } from './history.repository.js';
import { History } from './history.entity.js';
const repository = new HistoryRepository();
function sanitizeHistoryInput(req, res, next) {
    req.body.sanitizedInput = {
        startTime: req.body.startTime,
        precio: req.body.precio,
        idBlock: req.body.idBlock,
    };
    // Puedes realizar más validaciones y ajustes aquí según tus necesidades
    next();
}
function findAll(req, res) {
    res.json({ data: repository.findAll() });
}
function findOne(req, res) {
    const id = req.params.id;
    const history = repository.findOne({ id });
    if (!history) {
        return res.status(404).send({ message: 'History not found' });
    }
    res.json({ data: history });
}
function add(req, res) {
    const input = req.body.sanitizedInput;
    const historyInput = new History(input.startTime, input.precio, input.idBlock);
    const history = repository.add(historyInput);
    return res.status(201).send({ message: 'History created', data: history });
}
function update(req, res) {
    req.body.sanitizedInput.id = req.params.id;
    const history = repository.update(req.body.sanitizedInput);
    if (!history) {
        return res.status(404).send({ message: 'History not found' });
    }
    return res.status(200).send({ message: 'History updated successfully', data: history });
}
function remove(req, res) {
    const id = req.params.id;
    const history = repository.delete({ id });
    if (!history) {
        return res.status(404).send({ message: 'History not found' });
    }
    else {
        return res.status(200).send({ message: 'History deleted successfully' });
    }
}
export { sanitizeHistoryInput, findAll, findOne, add, update, remove, };
//# sourceMappingURL=history.controller.js.map