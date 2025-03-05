import { NextFunction, Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { DayOrderBlock } from "./day_order_block.entity.js";
import { compareAsc } from "date-fns";

const em = orm.em
em.getRepository(DayOrderBlock)

function sanitizeDOBInput(req: Request, res: Response, next: NextFunction) {
    req.body.sanitizeInput = {
        day: req.body.day,
        block: req.body.block,
        order: req.body.order,
    }
    Object.keys(req.body.sanitizeInput).forEach((key) => { //devuelve un arreglo con las keys y para cada uno chequeamos not null
        if (req.body.sanitizeInput[key] === undefined) {
            delete req.body.sanitizeInput[key]
        }
    })

    next()
}




async function findAll(req: Request, res: Response) {
    try {
        const dobs = await em.find(DayOrderBlock, {});
        res.status(200).json({ message: 'Find all DayOrderBlocks', data: dobs });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function findOne(req: Request, res: Response) {
    try {
        const id = req.params.id;
        const dob = await em.findOneOrFail(DayOrderBlock, { id });
        res.status(200).json({ message: 'DayOrderBlock found successfully', data: dob });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}


// estoy haciendo un cambio en la rama main 


async function findByDates(req: Request, res: Response) {
    try {
        const dateFrom = new Date(req.body.sanitizeInput.dateFrom)
        const dateTo = new Date(req.body.sanitizeInput.dateTo)
        if (compareAsc(dateFrom, dateTo) === 1){
            throw new Error('La fecha DESDE no puede ser mayor que la fecha HASTA')
        }
        console.log('Las fechas son desde: ', dateFrom, 'hasta ', dateTo)
        const dobs = await em.find(DayOrderBlock, {
            day: {
                $gte: dateFrom,  // Mayor o igual que fechaInicio
                $lte: dateTo      // Menor o igual que fechaFin
            }
        },{populate: ['order.spot']});
        const msj = 'Find DayOrderBlocks from: ' + dateFrom + ' to ' + dateTo
        res.status(200).json({ message: msj , data: dobs });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}


async function createNewDOB(o: string | undefined, b: string | undefined, d: Date) {
    //la orden ya existe. 
    if (b !== undefined && o !== undefined) {
        const newTern = em.create(DayOrderBlock, { day: d, block: b, order: o, })
        await em.flush()
        return newTern
    } else { console.log('No existe el metodo') }
}



export { createNewDOB, findAll, findOne, findByDates, sanitizeDOBInput }