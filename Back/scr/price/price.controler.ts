import { NextFunction, Request, Response } from "express";;
import { orm } from "../shared/db/orm.js";
import { Price } from "./price.entity.js";
import { Block } from "../block/block.entity.js";

const em = orm.em
em.getRepository(Price)
em.getRepository(Block)

function sanitizePriceInput(req: Request, res: Response, next: NextFunction) {
    req.body.sanitizeInput = {
        value: req.body.value,
        block: req.body.block
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
        const prices = await em.find(Price, {}, {populate:['block']})
        res.status(200).json({message: 'Find all Price', data: prices})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}

async function findOne(req: Request, res: Response) {
   try {
    const id = req.params.id
    const prices = await em.findOneOrFail(Price, { id }, {populate:['block']})
    res.status(200).json({message: 'Price founded sucsesfully', data:prices })
   } catch (error: any) {
     res.status(500).json({message: error.message})
   }
}


async  function add(req: Request, res: Response) {
    try{
        const price = em.create(Price, req.body.sanitizeInput)
        await em.flush()
        res.status(201).json({message: 'Price created succesfully', data: price})
    } catch(error: any) {
        res.status(500).json({message: error.message})
    }
}


async function update(req: Request, res: Response)  {
   try {
    const id = req.params.id
    const price = em.getReference(Price, id)
    em.assign(price, req.body.sanitizeInput)
    await em.flush()
    res.status(200).json({message: 'Price modificated succesfully', data: price})
   } catch (error: any) {
    res.status(500).json({message: error.message})
   }
}


async function remove(req: Request, res: Response) {
    try {
    const id = req.params.id
    const price = em.getReference(Price, id)
    await em.removeAndFlush(price)
    res.status(200).json({message: 'Price deleted succesfully', data: price})
    //duda: como verifico si realmente lo borra, porque 
    //cuando no lo encuentra me dice que se borro igual, 
    //pero realmente no se encontro el contacto.
   } catch (error: any) {
    res.status(500).json({message: error.message})
   }
}

async function addAllPrices (req: Request, res: Response){
    try {
        const blocks = await em.find(Block, {})
        let prices: Price[] = []
        blocks.forEach((blocks) => {
            req.body.sanitizeInput.block = blocks.id
            const price = em.create(Price, req.body.sanitizeInput)  
            prices.push(price)
           // console.log(blocks)
        }) 
        em.flush()
    res.status(200).json({message: 'All blocks whit a new price assigned', data: prices})

    } catch (error: any) {
    res.status(500).json({message: error.message})
   }

}


export {sanitizePriceInput, findAll, findOne, add, update, remove, addAllPrices}