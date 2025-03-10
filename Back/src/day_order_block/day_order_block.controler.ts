import { NextFunction, Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { DayOrderBlock } from "./day_order_block.entity.js";
import { compareAsc } from "date-fns";
import { Block } from "../block/block.entity.js";

const em = orm.em
em.getRepository(DayOrderBlock)

function sanitizeDOBInput(req: Request, res: Response, next: NextFunction) {
    req.body.sanitizeInput = {
        day: req.body.day,
        block: req.body.block,
        order: req.body.order,
        id: req.params.id
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



async function findByDates(req: Request, res: Response) {
    try {
        if (req.query.dateFrom === undefined) {
            return res.status(400).json({ message: "Debe enviarse una fecha Desde" });
        }
        const { dateFrom, dateTo } = req.query;

        const dF = new Date(dateFrom.toString())
        let dT: Date
        if (dateTo === undefined || dateTo === '') { dT = new Date() } else {
            dT = new Date(dateTo.toString())
        }
        if (compareAsc(dF, dT) === 1) {
            throw new Error('La fecha DESDE no puede ser mayor que la fecha HASTA')
        }
        console.log('Las fechas son desde: ', dF, 'hasta ', dT)
        const dobs = await em.find(DayOrderBlock, {
            day: {
                $gte: dF,  // Mayor o igual que fechaInicio
                $lte: dT      // Menor o igual que fechaFin
            }
        }, { populate: ['order.spot.id', 'block.startTime'] }
        );
        const msj = 'Find DayOrderBlocks from: ' + dF + ' to ' + dT
        const data = responseDataContructor(dobs)
        res.status(200).json({ message: msj, data: data });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}


function responseDataContructor(dobs: DayOrderBlock[]) {
    const data = []
    for (const dob of dobs) {
        data.push({
            id: dob.id,
            day: dob.day,
            block: dob.block.id,
            startTimeBlock: dob.block.startTime,
            order: dob.order.id,
            spot: dob.order.spot?.id,
            spotName: dob.order.spot?.name
        })

    }
    return data
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