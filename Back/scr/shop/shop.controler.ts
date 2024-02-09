import { NextFunction, Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Shop } from "./shop.entity.js";
import { Owner } from "../owner/owner.entity.js";


const em = orm.em //entityManager
em.getRepository(Shop)


function sanitizeShopInput(req: Request, res: Response, next: NextFunction) {
    req.body.sanitizeInput = {
        //regDate: req.body.regDate, //duda, no deberia entrar?
        fantasyName: req.body.fantasyName,
        address: req.body.address,
        billingType: req.body.billingType,
        mail: req.body.mail,
        usualPaymentForm: req.body.usualPaymentForm,
        type: req.body.type,
        //numShop: req.body.numShop,
        contact: req.body.contact,
        owner: req.body.owner
    }

    Object.keys(req.body.sanitizeInput).forEach( (key)=>{ //devuelve un arreglo con las keys y para cada uno chequeamos not null
        if (req.body.sanitizeInput[key] === undefined) {
            delete req.body.sanitizeInput[key]
        }
    })

    next()
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

async  function add(req: Request, res: Response) {
    try {
        const shop = em.create(Shop, req.body.sanitizeInput) //tengo un problema con el sanitazed input
        await em.flush() //seria como el save. Persiste. 
        res.status(200).json({message: 'Shop created successfully', data: shop})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}

async function update(req: Request, res: Response) {
    try {
        const id = req.params.id
        const shopToUpdate = await em.findOneOrFail(Shop, {id})
        em.assign(shopToUpdate, req.body.sanitizeInput) //deberia estar sanitizada
        await em.flush()
        res.status(200).json({message: 'Shop modified successfully', data: shopToUpdate})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}

async function remove(req: Request, res: Response) {
    try {
    const id = req.params.id
    const shop = await em.findOne(Shop, { id });
    if (shop) {
        await em.removeAndFlush(shop);
        res.status(200).json({ message: 'Shop deleted successfully', data: shop });
    } else {
        res.status(404).json({ message: 'Shop not found' });
    }
   } catch (error: any) {
    res.status(500).json({message: error.message})
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
      res.status(200).json({messagge: 'Shops found successfully', data: shops})
      
    } catch (error:any) {
      res.status(500).json({message: error.message})
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


export {sanitizeShopInput, findAll, findOne, add, update, remove, getShopsByOwnerId, getShopsByCuitAndFantasyName, getShopsByCuit}