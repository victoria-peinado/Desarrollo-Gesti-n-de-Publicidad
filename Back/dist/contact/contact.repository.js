import { Contact } from './contact.entity.js';
const contacts = [
    new Contact('Darth Vader', 'Sith', 43769477, ['4557789', 'darth@gmail.com'], 'a02b91bc-3769-4221-beb1-d7a3aeba7dad'),
];
export class ContactRepository {
    findAll() {
        return contacts;
    }
    findOne(item) {
        return contacts.find((character) => character.id === item.id);
    }
    add(item) {
        contacts.push(item);
        return item;
    }
    update(item) {
        const characterIdx = contacts.findIndex((character) => character.id === item.id);
        if (characterIdx !== -1) {
            contacts[characterIdx] = { ...contacts[characterIdx], ...item };
        }
        return contacts[characterIdx];
    }
    delete(item) {
        const characterIdx = contacts.findIndex((character) => character.id === item.id);
        if (characterIdx !== -1) {
            const deletedContact = contacts[characterIdx];
            contacts.splice(characterIdx, 1);
            return deletedContact;
        }
    }
}
//# sourceMappingURL=contact.repository.js.map