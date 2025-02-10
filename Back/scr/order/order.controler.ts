import { NextFunction, Request, Response } from "express";;
import { orm } from "../shared/db/orm.js";
import { Order } from "./order.entity.js";

const em = orm.em
em.getRepository(Order)

function sanitizeOrderInput(req: Request, res: Response, next: NextFunction) {
    req.body.sanitizeInput = {
        numOrder: req.body.numOrder,
        regDate: req.body.regDate,
        totalAds: req.body.totalAds,
        daysAmount: req.body.daysAmount, 
        nameStrategy: req.body.nameStrategy,
        totalCost: req.body.totalCost,
        dailyCost: req.body.dailyCost,
        obs: req.body.obs,
        showName: req.body.showName,
        month: req.body.month,
        regular: req.body.regular,
        regStructure:req.body.regStructure,
        cancelDate: req.body.cancelDate,
        notRegStructure: req.body.notRegStructure,
        contract: req.body.contract,
        spot: req.body.spot
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
        const orders = await em.find(Order, {}, {populate: ['contract', 'spot']})
        res.status(200).json({message: 'Find all Orders', data: orders})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
    }

async function findOne(req: Request, res: Response) {
   try {
    const id = req.params.id
    const order = await em.findOneOrFail(Order, { id })
    res.status(200).json({message: 'Order founded sucsesfully', data: order})
   } catch (error: any) {
     res.status(500).json({message: error.message})
   }
}


async  function add(req: Request, res: Response) {
    try{
        //calcular parametros
        //un if para el estudio si es regular. 
        const order = em.create(Order, req.body.sanitizeInput)
        //asignamos id
        //relacionamos con otros objetos
        await em.flush()
        res.status(201).json({message: 'Order created succesfully', data: order})
    } catch(error: any) {
        res.status(500).json({message: error.message})
    }
}


async function update(req: Request, res: Response)  {
   try {
    const id = req.params.id
    const order = em.getReference(Order, id)
    em.assign(order, req.body.sanitizeInput)
    await em.flush()
    res.status(200).json({message: 'Order modificated succesfully', data: order})
   } catch (error: any) {
    res.status(500).json({message: error.message})
   }
}


async function remove(req: Request, res: Response) {
    try {
    const id = req.params.id
    const order = em.getReference(Order, id)
    await em.removeAndFlush(order)
    res.status(200).json({message: 'Order deleted succesfully', data: order})
    //duda: como verifico si realmente lo borra, porque 
    //cuando no lo encuentra me dice que se borro igual, 
    //pero realmente no se encontro el contacto.
   } catch (error: any) {
    res.status(500).json({message: error.message})
   }
}

export {sanitizeOrderInput, findAll, findOne, add, update, remove}

// ORDEN REGULAR
// Bloques_regular = [[1,2,3,4], [1,2,3,4], [10,11,15,16], [10,11,15,16], [id_bloque], [], []]
// Bloques_regular = [[lunes], [martes], [miercoles], [jueves], [viernes], [sabado], [domingo]]
// bloques[lunes] = [1,2,4,5]
// en este caso regular = true, tengo que construir las ternarias del mes. 

// Bloque_NO_regular[(id, 1/1/25, [1,2,3,5]), (id, 2/1/25, [1,2,3,5]),.... ]
// Nota mental: el id es mio, esto mismo lo registro en el objeto ternaria. Si o si, despues