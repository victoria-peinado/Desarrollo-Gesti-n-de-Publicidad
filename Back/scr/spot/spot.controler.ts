import { NextFunction, Request, Response } from "express";;
import { orm } from "../shared/db/orm.js";
import { Spot } from "./spot.entity.js";

const em = orm.em
em.getRepository(Spot)

function sanitizeSpotInput(req: Request, res: Response, next: NextFunction) {
    req.body.sanitizeInput = {
        long: req.body.long,
        name: req.body.name,
        order: req.body.order
    }
    Object.keys(req.body.sanitizeInput).forEach( (key)=>{ 
            if (req.body.sanitizeInput[key] === undefined) {
            delete req.body.sanitizeInput[key]
        }
    })

    next()
}


async function findAll(req: Request, res: Response) {
      try {
        const spots = await em.find(Spot, {})
        res.status(200).json({message: 'Find all Spots', data: spots})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
    }

async function findOne(req: Request, res: Response) {
   try {
    const id = req.params.id
    const spot = await em.findOneOrFail(Spot, { id })
    res.status(200).json({message: 'Spot founded sucsesfully', data: spot})
   } catch (error: any) {
     res.status(500).json({message: error.message})
   }
}


async  function add(req: Request, res: Response) {
    try{
        const spot = em.create(Spot, req.body.sanitizeInput)
        await em.flush()
        res.status(201).json({message: 'Spot created succesfully', data: spot})
    } catch(error: any) {
        res.status(500).json({message: error.message})
    }
}


async function update(req: Request, res: Response)  {
   try {
    const id = req.params.id
    const spot = em.getReference(Spot, id)
    em.assign(spot, req.body.sanitizeInput)
    await em.flush()
    res.status(200).json({message: 'Spot modificated succesfully', data: spot})
   } catch (error: any) {
    res.status(500).json({message: error.message})
   }
}


async function remove(req: Request, res: Response) {
    try {
    const id = req.params.id
    const spot = em.getReference(Spot, id)
    await em.removeAndFlush(spot)
    res.status(200).json({message: 'Spot deleted succesfully', data: spot})
    //duda: como verifico si realmente lo borra, porque 
    //cuando no lo encuentra me dice que se borro igual, 
    //pero realmente no se encontro el contacto.
   } catch (error: any) {
    res.status(500).json({message: error.message})
   }
}

export {sanitizeSpotInput, findAll, findOne, add, update, remove}