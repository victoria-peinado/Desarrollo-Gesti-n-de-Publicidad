export class Contact{
    _id?: number
    dni: string
    name: string
    lastname: string
    contacts:string[]
    constructor(dni: string, name: string, lastname: string, contacts: string[]){
        this.dni = dni
        this.name = name
        this.lastname = lastname
        this.contacts = contacts
    }
}