import { NextFunction, Request, Response } from "express";;
import { orm } from "../shared/db/orm.js";
import { Order } from "./order.entity.js";
import {BlocksRegularSchema, BlocksRegularType, TupleBlocksType} from "../shared/db/schemas.js";
import { Contact } from "../contact/contact.entity.js";
import { Contract } from "../contract/contract.entity.js";
import { eachDayOfInterval, lastDayOfMonth, format, compareAsc, addDays } from 'date-fns';
import { rewriteDaysArray } from "../shared/datesUtilities.js";
import { DayOrderBlock } from "../day_order_block/day_order_block.entity.js";
import { Block } from "../block/block.entity.js";


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

// este metodo solo se llama para crear una nueva orden.
async  function add(req: Request, res: Response) {
    try{
        let tuples: TupleBlocksType[] = []
        let dateFrom: Date = new Date()
        if (req.body.sanitizeInput.regular){
            //controlar que todos los bloques existan, se puede hacer una funcion que los quite del arreglo y devuelva la lista de id.
            const id = req.body.sanitizeInput.contract
            const contract = await em.findOneOrFail(Contract, {id})
            dateFrom = contract.dateFrom
            if (compareAsc(dateFrom, new Date()) == -1){ // si = -1 desde esta antes que hoy por ende ya paso
                dateFrom = addDays(new Date(), 1) // asignamos como inicio la fecha de mañana. 
            } 
            const regStructure = req.body.sanitizeInput.regStructure
            tuples = createTuples(regStructure, dateFrom)
        } else {
            //las tuplas deberían venir del front.
            
        }
        let totalAds = 0
        tuples.forEach(t => {totalAds = totalAds + t[1].length});
        req.body.sanitizeInput.totalAds = totalAds
        req.body.sanitizeInput.daysAmount = tuples.length
        req.body.sanitizeInput.month = format(dateFrom, 'MM-yyyy' )
        //calcular parametros
        const order = em.create(Order, req.body.sanitizeInput)
        const blocks = await em.find(Block, {},{populate:['prices']}) 
        let ternarias: Array<DayOrderBlock> = []
        let totalCost = 0
        tuples.forEach(t => { 
            t[1].forEach(b => {
                let dob = em.create(DayOrderBlock, {day: t[0], block: b, order: order})
                ternarias.push(dob)
                let actual = blocks.find((e)=> e.id = b)
                let prices_block = actual?.prices
                let items = prices_block?.getItems()
                let last_price = items?.at(-1)?.value
                if (last_price == undefined) {last_price=0} //para que no se queje
                totalCost = totalCost + last_price
            });
        });
        order.totalCost = totalCost;
        //asignamos id
        //relacionamos con otros objetos tuplas
        // ¿se guarda solo? ¿Ya esta?  deberia estar jajajaja. 
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
        return res.status(403).json({ message: 'This operation is not allowed' });


        // const id = req.params.id;
        // const order = em.getReference(Order, id);
        // await em.removeAndFlush(order);
        // res.status(200).json({ message: 'Order deleted successfully', data: order });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

function createTuples(regStructure: BlocksRegularType, dateFrom: Date){ 
    // reg = [monday:['1','2', '3'], tues:[id_block], wend:[],....]
    let tuples: TupleBlocksType[] = []
    const structure = rewriteDaysArray(regStructure)
    const lastDay = lastDayOfMonth(dateFrom)
    const daysOfMonth = eachDayOfInterval({start: dateFrom, end: lastDay}) //dias que quedan del mes desde la fecha de inicio (puede ser desde el 1-mes o desde el 15-mes)
    daysOfMonth.forEach(day => {
        const dayNum = day.getDay()
        if (structure[dayNum].length > 0) { //si ese dia hay bloques lo agregamos a la tupla, sino lo pasamos. 
            tuples.push([day, structure[dayNum]])}
    }); // para cada dia restante del mes, desde el dia de inicio de la contratacion, o desde mañana (si la contratacion dateFrom ya pasó).

    return tuples
}







export {sanitizeOrderInput, findAll, findOne, add, update, remove}

// ORDEN REGULAR
// Bloques_regular = [[1,2,3,4], [1,2,3,4], [10,11,15,16], [10,11,15,16], [id_bloque], [], []]
// Bloques_regular = [[lunes], [martes], [miercoles], [jueves], [viernes], [sabado], [domingo]]
// bloques[lunes] = [1,2,4,5]
// en este caso regular = true, tengo que construir las ternarias del mes. 

// Bloque_NO_regular[(id, 1/1/25, [1,2,3,5]), (id, 2/1/25, [1,2,3,5]),.... ]
// Nota mental: el id es mio, esto mismo lo registro en el objeto ternaria. Si o si, despues