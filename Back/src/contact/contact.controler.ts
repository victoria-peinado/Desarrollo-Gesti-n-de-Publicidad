import { NextFunction, Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Contact } from "./contact.entity.js";
import{ Shop } from '../shop/shop.entity.js'
import { validateIdsExistence, validateUniqueFields } from "../shared/db/validations.js";
import { EntityRepository } from "@mikro-orm/core";

const em = orm.em
em.getRepository(Contact)

function sanitizeContactInput(req: Request, res: Response, next: NextFunction) {
    req.body.sanitizeInput = {
        dni: req.body.dni,
        name: req.body.name,
        lastname: req.body.lastname,
        contacts: req.body.contacts,
        id: req.params.id,
    }
// la ID no la consideramos? Creo que nunca deberia venir en el cuerpo del mensaje. Si en la data de la request
    Object.keys(req.body.sanitizeInput).forEach( (key)=>{ //devuelve un arreglo con las keys y para cada uno chequeamos not null
        if (req.body.sanitizeInput[key] === undefined) {
            delete req.body.sanitizeInput[key]
        }
    })

    next()
}

async function validateIdsAndUniques<T extends object>(
    sanitizeInput: Partial<T>
): Promise<{ valid: boolean; messages: string[] }> {
    // Usar el EntityManager definido anteriormente

    // Definir repositorios para validación de unicidad
    const uniqueFieldsMap = {
        dni: em.getRepository(Contact),
    };

    // Ejecutar validaciones
    const uniqueValidation = await validateUniqueFields(
        uniqueFieldsMap as Record<keyof T, EntityRepository<T>>, 
        sanitizeInput);

    // Combinar errores
    const allErrors = [ ...uniqueValidation.messages];


    return {
        valid: allErrors.length === 0,
        messages: allErrors
    };
}
async function validateRequestInput(res: Response, sanitizeInput: any): Promise<boolean> {
    try {
        const validation = await validateIdsAndUniques(sanitizeInput);
        if (!validation.valid) {
            res.status(400).json({ messages: validation.messages });
            return false;
        }
        return true;
    } catch (validationError: any) {
        res.status(500).json({ message: 'Validation failed', error: validationError.message });
        return false;
    }
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
    const sanitizeInput = req.body.sanitizeInput;

    if (!(await validateRequestInput(res, sanitizeInput))) {
      return;
    }

    try {
      const contact = em.create(Contact, sanitizeInput);
      await em.flush();
      res.status(201).json({ message: 'Contact created successfully', data: contact });
    } catch (creationError: any) {
      res.status(500).json({ message: 'Contact creation failed', error: creationError.message });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Unexpected error', error: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const sanitizeInput = req.body.sanitizeInput;

    if (!(await validateRequestInput(res, sanitizeInput))) {
      return;
    }

    try {
      const contact = em.getReference(Contact, id);
      em.assign(contact, sanitizeInput);
      await em.flush();
      res.status(200).json({ message: 'Contact modified successfully', data: contact });
    } catch (updateError: any) {
      res.status(500).json({ message: 'Contact update failed', error: updateError.message });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Unexpected error', error: error.message });
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

async function getContactByDni(req: Request, res: Response) {
    try {
        const dni = req.params.dni;
        const contact = await em.findOneOrFail(Contact, { dni });

        if (!contact) {
            return res.status(404).json({ msg: "Contact not found" });
        }
        res.status(200).json({message: 'Contact found successfully', data: contact})

    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
};

export {sanitizeContactInput, findAll, findOne, add, update, remove, getContactByDni}