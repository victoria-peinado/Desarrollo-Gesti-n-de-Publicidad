import { NextFunction, Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Shop } from "./shop.entity.js";
import { Owner } from "../owner/owner.entity.js";
import { Contract } from "../contract/contract.entity.js";
import { validateIdsExistence, validateUniqueFields } from "../shared/db/validations.js";
import { EntityRepository } from "@mikro-orm/core";
import { Contact } from "../contact/contact.entity.js";

const em = orm.em //entityManager
em.getRepository(Shop)


function sanitizeShopInput(req: Request, res: Response, next: NextFunction) {
    req.body.sanitizeInput = {
        //regDate: req.body.regDate, //duda, no deberia entrar?
        fantasyName: req.body.fantasyName,
        id: req.params.id,
        billingType: req.body.billingType,
        mail: req.body.mail,
        usualPaymentForm: req.body.usualPaymentForm,
        type: req.body.type,
        //numShop: req.body.numShop,
        contact: req.body.contact,
        owner: req.body.owner,
        //adress
        address: req.body.address,

        // streat: req.body.streat,
        // number: req.body.number,
        // level: req.body.level,
        // department: req.body.department,
        // postalCode: req.body.postalCode,
        // city: req.body.city,
        // province: req.body.province,    
        
        
    }

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

    const repositoryMap = {
        owner: em.getRepository(Owner),
        contact: em.getRepository(Contact),
    };


    // Ejecutar validaciones
    const idValidation = await validateIdsExistence(
        repositoryMap as Record<keyof T, EntityRepository<T>>, 
        sanitizeInput);


    // Combinar errores
    const allErrors = [...idValidation.messages];


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

// CRUD functions
async function findAll(req: Request, res: Response) {
    try {
        const shops = await em.find(Shop, {}, {populate:['contact', 'owner']}) //no pongo contrataciones porque no esta desarrollada
        res.status(200).json({message: 'All shops found successfully', data: shops})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
    
}

async function findOne(req: Request, res: Response) {
    try {
        const id = req.params.id
        const shop = await em.findOneOrFail(Shop, {id}, {populate: ['contact', 'owner']})
        res.status(200).json({message: 'Shop found successfully', data: shop})
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
      const shop = em.create(Shop, sanitizeInput);
      await em.flush();
      res.status(201).json({ message: 'Shop created successfully', data: shop });
    } catch (creationError: any) {
      res.status(500).json({ message: 'Shop creation failed', error: creationError.message });
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
      const shopToUpdate = await em.findOneOrFail(Shop, { id });
      em.assign(shopToUpdate, sanitizeInput);
      await em.flush();
      res.status(200).json({ message: 'Shop modified successfully', data: shopToUpdate });
    } catch (updateError: any) {
      res.status(500).json({ message: 'Shop update failed', error: updateError.message });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Unexpected error', error: error.message });
  }
}

async function remove(req: Request, res: Response) {
    try {
        const id = req.params.id;
        const shop = await em.findOne(Shop, { id });
        if (!shop) return res.status(404).json({ message: 'Shop not found' });

        const isReferenced = await em.count(Contract, { shop: shop.id });
        if (isReferenced > 0) return res.status(400).json({ message: 'Cannot delete shop because it is referenced in a contract' });

        await em.removeAndFlush(shop);
        res.status(200).json({ message: 'Shop deleted successfully', data: shop });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}


// Other functions
async function getShopsByOwnerId(req: Request, res: Response) {
    try {
        const idOwner = req.params.ownerId
        const shops = await em.find(Shop, {owner: idOwner}, {populate: ['contact', 'owner']})
        res.status(200).json({message: 'Shops found successfully', data: shops})

    } catch (error:any) {
        res.status(500).json({message: error.message})
    }
    
};

async function getShopsByCuitAndFantasyName(req: Request, res: Response) {
  const { fantasyName, cuit } = req.query;

  try {
    const owner = await em.findOne(Owner, { cuit: cuit as string });

    if (!owner) {
      return res.status(404).json({ error: 'Owner not found for the provided cuit' });
    }

    const shops = await em.find(Shop, { fantasyName: new RegExp(fantasyName as string, 'i'), owner });

    if (shops.length === 0) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    res.status(200).json({ message: 'Shops found successfully', data: shops });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
async function getShopsByCuit(req: Request, res: Response) {
    try {
        const cuit = req.params.cuit;
        const owner = await em.findOne(Owner, { cuit: cuit as string });

        if (!owner) {
            return res.status(404).json({ error: 'Owner not found for the provided cuit' });
        }

        const shops = await em.find(Shop, { owner });
        res.status(200).json({messagge: 'Shops found successfully', data: shops})

    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
};


// async function validateIdsAndUniques<T extends object>(
//     em: EntityManager, 
//     sanitizeInput: Partial<T>
// ): Promise<{ valid: boolean; messages: string[] }> {
//     // Definir repositorios para validación de IDs
//     const repositoryMap = {
//         owner: em.getRepository(Owner),
//         contact: em.getRepository(Contact),
//     };

//     // Definir repositorios para validación de unicidad
//     const uniqueFieldsMap = {
//         email: em.getRepository(Contact),
//         phoneNumber: em.getRepository(Contact),
//     };

//     // Ejecutar validaciones
//     const idValidation = await validateIdsExistence(repositoryMap, sanitizeInput);
//     const uniqueValidation = await validateUniqueFields(uniqueFieldsMap, sanitizeInput);

//     // Combinar errores
//     const allErrors = [...idValidation.messages, ...uniqueValidation.messages];

//     return {
//         valid: allErrors.length === 0,
//         messages: allErrors
//     };
// }
// async function update(req: Request, res: Response) {
//     try {
//         const id = req.params.id;
//         const sanitizeInput = req.body.sanitizeInput; // Se asume que ya está sanitizado

//         // Llamar a la validación general
//         const validation = await validateIdsAndUniques(em, sanitizeInput);

//         if (!validation.valid) {
//             return res.status(400).json({ messages: validation.messages });
//         }

//         // Proceder con la actualización
//         const shopToUpdate = await em.findOneOrFail(Shop, { id });
//         em.assign(shopToUpdate, sanitizeInput);
//         await em.flush();

//         res.status(200).json({ message: 'Shop modified successfully', data: shopToUpdate });
//     } catch (error: any) {
//         res.status(500).json({ message: error.message });
//     }
// }

export {sanitizeShopInput, findAll, findOne, add, update, remove, getShopsByOwnerId, getShopsByCuitAndFantasyName, getShopsByCuit}