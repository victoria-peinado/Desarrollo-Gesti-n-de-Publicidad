import { NextFunction, Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Contact } from "./contact.entity.js";
import{ Shop } from '../shop/shop.entity.js'


const em = orm.em
em.getRepository(Contact)

function sanitizeContactInput(req: Request, res: Response, next: NextFunction) {
    req.body.sanitizeInput = {
        dni: req.body.dni,
        name: req.body.name,
        lastname: req.body.lastname,
        contacts: req.body.contacts
    }
// la ID no la consideramos? Creo que nunca deberia venir en el cuerpo del mensaje. Si en la data de la request
    Object.keys(req.body.sanitizeInput).forEach( (key)=>{ //devuelve un arreglo con las keys y para cada uno chequeamos not null
        if (req.body.sanitizeInput[key] === undefined) {
            delete req.body.sanitizeInput[key]
        }
    })

    next()
}

async function findAll(req: Request, res: Response) {
    try {
        const contacts = await em.find(Contact, {}) // en el 2do argumento se especifican los criterios de búsqueda, en este caso queremos traer todo así que se indica {}
        res.status(200).json({message: 'All contacts found successfully', data: contacts})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
    }

async function findOne(req: Request, res: Response) {
   try {
    const id = req.params.id
    const contact = await em.findOneOrFail(Contact, { id })
    res.status(200).json({message: 'Contact found successfully', data: contact})
   } catch (error: any) {
     res.status(500).json({message: error.message})
   }
}

async function add(req: Request, res: Response) {
    try {
        const contact = em.create(Contact, req.body.sanitizeInput)
        await em.flush() // persiste en la bd
        res.status(201).json({message: 'Contact created successfully', data: contact})
    } catch(error: any) {
        res.status(500).json({message: error.message})
    }
}

async function update(req: Request, res: Response) {
   try {
    const id = req.params.id
    const contact = em.getReference(Contact, id)
    em.assign(contact, req.body.sanitizeInput)
    await em.flush()
    res.status(200).json({message: 'Contact modified successfully', data: contact})
   } catch (error: any) {
    res.status(500).json({message: error.message})
   }
}

async function remove(req: Request, res: Response) {
    try {
        const id = req.params.id;

        // Check if the contact exists
        const contact = await em.findOne(Contact, { id });
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        // Check if the contact is referenced in any shop
        const isReferenced = await em.count(Shop, { contact: contact.id });
        if (isReferenced > 0) {
            return res.status(400).json({ message: 'Cannot delete contact because it is referenced in a shop' });
        }

        // Delete the contact
        await em.removeAndFlush(contact);
        res.status(200).json({ message: 'Contact deleted successfully', data: contact });

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export {sanitizeContactInput, findAll, findOne, add, update, remove}