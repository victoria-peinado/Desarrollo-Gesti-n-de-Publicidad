import { NextFunction, Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Contract } from "./contract.entity.js";
import { EntityRepository } from "@mikro-orm/core";	
import { Shop } from "../shop/shop.entity.js";
import { validateUniqueFields,validateIdsExistence } from "../shared/db/validations.js";
import { compareAsc } from "date-fns";

const em = orm.em //entityManager
em.getRepository(Contract)
async function validateIdsAndUniques<T extends object>(
    sanitizeInput: Partial<T>
): Promise<{ valid: boolean; messages: string[] }> {
    // Usar el EntityManager definido anteriormente

    const uniqueFieldsMap = {
        shop: em.getRepository(Shop) as unknown as EntityRepository<T>,
    };

    
     const idValidation = await validateIdsExistence(uniqueFieldsMap as Record<keyof T, EntityRepository<T>>, sanitizeInput);

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



function sanitizeContractInput(req: Request, res: Response, next: NextFunction) {
    req.body.sanitizeInput = {
        regDate : req.body.regDate,
        dateFrom : req.body.dateFrom,
        dateTo : req.body.dateTo,
        observations : req.body.observations,
        shop: req.body.shop,
        id: req.params.id
    }

    Object.keys(req.body.sanitizeInput).forEach( (key)=>{ //devuelve un arreglo con las keys y para cada uno chequeamos not null
        if (req.body.sanitizeInput[key] === undefined) {
            delete req.body.sanitizeInput[key]
        }
    })

    next()
}

async function findAll(req: Request, res: Response) {
    try {
        const contracts = await em.find(Contract, {}, {populate:['shop', 'orders']}) 
        res.status(200).json({message: 'Find all Contracts', data: contracts})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
    
}

async function findOne(req: Request, res: Response) {
     try {
        const id = req.params.id
        const contract = await em.findOneOrFail(Contract, {id}, {populate: ['shop']})
        res.status(200).json({message: 'Contract founded', data: contract})
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
      const contract = em.create(Contract, sanitizeInput);
      await em.flush();
      res.status(201).json({ message: 'Contract created successfully', data: contract });
    } catch (creationError: any) {
      res.status(500).json({ message: 'Contract creation failed', error: creationError.message });
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
      const contractToUpdate = await em.findOneOrFail(Contract, { id });
      if (contractToUpdate.dateTo !== undefined){
          const today = new Date()
        if (compareAsc(contractToUpdate.dateTo, today)<=0){
          //si el contrato ya termino
          return res.status(500).json({ message: 'Is not possible edit finished contracts.' })
        }
      }
      em.assign(contractToUpdate, sanitizeInput);
      await em.flush();
      res.status(200).json({ message: 'Contract updated successfully', data: contractToUpdate });
    } catch (updateError: any) {
      res.status(500).json({ message: 'Contract update failed', error: updateError.message });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Unexpected error', error: error.message });
  }
}

async function remove(req: Request, res: Response) {
    try {
        return res.status(403).json({ message: 'This operation is not allowed' });

        // const id = req.params.id;
        // const contractToRemove = em.getReference(Contract, id);
        // await em.removeAndFlush(contractToRemove); // Should be sanitized

        // res.status(200).json({ message: 'Contract removed successfully', data: contractToRemove });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function getContractsByShopId(req: Request, res: Response) {
    try {
        const idShop = req.params.idShop
        const contracts = await em.find(Contract, {shop: idShop}, {populate: ['shop']} ) //¿popular con contacto y titular?
        res.status(200).json({message: 'Contract founded sucesfully', data: contracts})
    } catch (error : any) {
        res.status(500).json({message: error.message})
    }
}

export {sanitizeContractInput, getContractsByShopId, findAll, findOne, add, update, remove}