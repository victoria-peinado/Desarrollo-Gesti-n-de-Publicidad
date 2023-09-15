import crypto from 'node:crypto';
export class Contact {
    constructor(name, lastName, dni, contacts, id = crypto.randomUUID()) {
        this.name = name;
        this.lastName = lastName;
        this.dni = dni;
        this.contacts = contacts;
        this.id = id;
    }
}
//# sourceMappingURL=contact.entity.js.map