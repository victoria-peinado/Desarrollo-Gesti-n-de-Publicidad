export class Contact {
    _id?: string;
    dni: string;
    name: string;
    lastname: string;
    contacts: string[];
    shops: string[];

    constructor(dni: string, name: string, lastname: string, contacts: string[], shops: string[]) {
        this.dni = dni;
        this.name = name;
        this.lastname = lastname;
        this.contacts = contacts;
        this.shops = shops;
    }
}