import { ContactRepository } from './contact.repository.js';
import { Contact } from './contact.entity.js';
const repository = new ContactRepository();
function sanitizeContactInput(req, res, next) {
    req.body.sanitizedInput = {
        name: req.body.name,
        lastName: req.body.lastName,
        dni: req.body.dni,
        contacts: req.body.contacts
    };
    //more checks here
    Object.keys(req.body.sanitizedInput).forEach((key) => {
        if (req.body.sanitizedInput[key] === undefined) {
            delete req.body.sanitizedInput[key];
        }
    });
    next();
}
function findAll(req, res) {
    res.json({ data: repository.findAll() });
}
function findOne(req, res) {
    const id = req.params.id;
    const contact = repository.findOne({ id });
    if (!contact) {
        return res.status(404).send({ message: 'Contact not found' });
    }
    res.json({ data: contact });
}
function add(req, res) {
    const input = req.body.sanitizedInput;
    const contactInput = new Contact(input.name, input.lastName, input.dni, input.contacts);
    const contact = repository.add(contactInput);
    return res.status(201).send({ message: 'Contact created', data: contact });
}
function update(req, res) {
    req.body.sanitizedInput.id = req.params.id;
    const contact = repository.update(req.body.sanitizedInput);
    if (!contact) {
        return res.status(404).send({ message: 'Contact not found' });
    }
    return res.status(200).send({ message: 'Contact updated successfully', data: contact });
}
function remove(req, res) {
    const id = req.params.id;
    const contact = repository.delete({ id });
    if (!contact) {
        res.status(404).send({ message: 'Contact not found' });
    }
    else {
        res.status(200).send({ message: 'Contact deleted successfully' });
    }
}
export { sanitizeContactInput, findAll, findOne, add, update, remove };
//# sourceMappingURL=contact.controler.js.map