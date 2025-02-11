import { NextFunction, Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Contract } from "./contract.entity.js";

const em = orm.em //entityManager
em.getRepository(Contract)



function sanitizeContractInput(req: Request, res: Response, next: NextFunction) {
    req.body.sanitizeInput = {
        regDate : req.body.regDate,
        dateFrom : req.body.dateFrom,
        dateTo : req.body.dateTo,
        observations : req.body.observations,
        shop: req.body.shop
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


async  function add(req: Request, res: Response) {
     try {
        //Preguntar como hacer las validaciones. Supongo que con funciones externas.
        const contract = em.create(Contract, req.body.sanitizeInput) //DEBERIA VALIDAR QUE EXISTA EL COMERCIO
        await em.flush() 
        res.status(200).json({message: 'Contract created sucesfully', data: contract})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}


async function update(req: Request, res: Response)  {
    try {
        const id = req.params.id
        const contractToUpdate = await em.findOneOrFail(Contract, {id})
        em.assign(contractToUpdate, req.body.sanitizeInput) //deberia estar sanitizada
        await em.flush()
        res.status(200).json({message: 'Contract updeted sucesfully', data: contractToUpdate})
    } catch (error: any) {
        res.status(500).json({message: error.message})
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

async function getByShop(req: Request, res: Response) {
    try {
        const idShop = req.params.idShop
        const contracts = await em.find(Contract, {shop: idShop}, {populate: ['shop']} ) //¿popular con contacto y titular?
        res.status(200).json({message: 'Contract founded sucesfully', data: contracts})
    } catch (error : any) {
        res.status(500).json({message: error.message})
    }
}

export {sanitizeContractInput, getByShop, findAll, findOne, add, update, remove}