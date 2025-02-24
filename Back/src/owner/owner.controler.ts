// DUDA: no lo populo con shops, pues deberian no estar creados al momento de pedir estos. 


import { NextFunction, Request, Response } from "express";;
import { orm } from "../shared/db/orm.js";
import { Owner } from "./owner.entity.js";
import { Shop } from "../shop/shop.entity.js";

const em = orm.em
em.getRepository(Owner)

function sanitizeOwnerInput(req: Request, res: Response, next: NextFunction) {
    req.body.sanitizeInput = {
        cuit: req.body.cuit,
        businessName: req.body.businessName,
        fiscalCondition: req.body.fiscalCondition,
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
    const owners = await em.find(Owner, {}, { populate: ['shops'] }); // Agregar await
    res.status(200).json({ message: 'All owners found successfully', data: owners });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
async function findOne(req: Request, res: Response) {
   try {
    const id = req.params.id
    const owner = await em.findOneOrFail(Owner, { id }, { populate: ['shops', 'shops.contact'] })
    res.status(200).json({message: 'Owner found successfully', data: owner})
   } catch (error: any) {
     res.status(500).json({message: error.message})
   }
}


async  function add(req: Request, res: Response) {
    try{
        const owner = em.create(Owner, req.body.sanitizeInput)
        await em.flush()
        res.status(201).json({message: 'Owner created successfully', data: owner})
    } catch(error: any) {
        res.status(500).json({message: error.message})
    }
}


async function update(req: Request, res: Response)  {
   try {
    const id = req.params.id
    const owner = em.getReference(Owner, id)
    em.assign(owner, req.body.sanitizeInput)
    await em.flush()
    res.status(200).json({message: 'Owner modified successfully', data: owner})
   } catch (error: any) {
    res.status(500).json({message: error.message})
   }
}


async function remove(req: Request, res: Response) {
    try {
        const id = req.params.id;
        const owner = await em.findOne(Owner, { id });
        if (!owner) return res.status(404).json({ message: 'Owner not found' });

        const isReferenced = await em.count(Shop, { owner: owner.id });
        if (isReferenced > 0) return res.status(400).json({ message: 'Cannot delete owner because it is referenced in a shop' });

        await em.removeAndFlush(owner);
        res.status(200).json({ message: 'Owner deleted successfully', data: owner });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}
async function getOwnerByCuit(req: Request, res: Response) {
    try {
        const cuit = req.params.cuit;
        const owner = await em.findOne(Owner, { cuit });

        if (!owner) {
            return res.status(404).json({ msg: "Owner not found" });
        }

        res.status(200).json({message: 'Owner found successfully', data: owner})

    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
};

export {sanitizeOwnerInput, findAll, findOne, add, update, remove, getOwnerByCuit}