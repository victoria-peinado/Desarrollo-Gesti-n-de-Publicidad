import { NextFunction, Request, Response } from "express";;
import { orm } from "../shared/db/orm.js";
import { Order } from "./order.entity.js";
import { BlocksRegularSchema, BlocksRegularType, TupleBlocksType } from "../shared/db/schemas.js";
import { Contact } from "../contact/contact.entity.js";
import { Contract } from "../contract/contract.entity.js";
import { eachDayOfInterval, lastDayOfMonth, format, compareAsc, addDays } from 'date-fns';
import { rewriteDaysArray } from "../shared/datesUtilities.js";
import { DayOrderBlock } from "../day_order_block/day_order_block.entity.js";
import { Block } from "../block/block.entity.js";
import { checkAll, numsToIds, numsToIds2 } from "../block/block.controler.js";


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
        regStructure: req.body.regStructure,
        cancelDate: req.body.cancelDate,
        notRegStructure: req.body.notRegStructure,
        contract: req.body.contract,
        spot: req.body.spot
    }
    Object.keys(req.body.sanitizeInput).forEach((key) => {
        if (req.body.sanitizeInput[key] === undefined) {
            delete req.body.sanitizeInput[key]
        }
    })

    next()
}


async function findAll(req: Request, res: Response) {
    try {
        const orders = await em.find(Order, {}, { populate: ['contract', 'spot'] })
        res.status(200).json({ message: 'Find all Orders', data: orders })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

async function findOne(req: Request, res: Response) {
    try {
        const id = req.params.id
        const order = await em.findOneOrFail(Order, { id })
        res.status(200).json({ message: 'Order founded sucsesfully', data: order })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

// este metodo solo se llama para crear una nueva orden.
async function add(req: Request, res: Response) {
    try {
        // Verificamos contrato.
        const id = req.body.sanitizeInput.contract
        const contract = await em.findOneOrFail(Contract, { id })
        //console.log('Contrato encontrado : ', contract)
        let dateFrom = contract.dateFrom

        // Verificamos fecha inicio Orden.
        if (compareAsc(dateFrom, new Date()) == -1) { // si = -1 desde esta antes que hoy por ende ya paso
            dateFrom = addDays(new Date(), 1) // asignamos como inicio la fecha de mañana. 
            console.log('Asignamos la fecha de mañana: ', dateFrom)
        }

        const order = em.create(Order, req.body.sanitizeInput);
        order.month = format(dateFrom, 'MM-yyyy')
        order.totalCost = 0
        await em.flush();

        if (order?._id === undefined) {
            throw new Error('Error al crear la orden. No tiene id');
        } else { order.id = order._id.toString() }


        let tuples: TupleBlocksType[] = []

        if (req.body.sanitizeInput.regular) {
            const regStructure: BlocksRegularType = req.body.sanitizeInput.regStructure
            tuples = await createTuples2(regStructure, dateFrom)
        } else {
            tuples = await createNotRegularTuples(req.body.sanitizeInput.notRegStructure, dateFrom)
        }

        //Calcular totalAds - daysAmount - month
        let totalAds = 0
        tuples.forEach(t => { totalAds = totalAds + t[1].length });
        order.totalAds = totalAds
        order.daysAmount = tuples.length

        //calcular parametros
        const allBlocks = await em.find(Block, {}, { populate: ['prices', 'prices.value'] })
        let ternarias: Array<DayOrderBlock> = []

        let totalCost = 0;
        const dobs: DayOrderBlock[] = []

        // Iteramos sobre cada tupla
        for (const tup of tuples) {  // tup[0] es la fecha, tup[1] es la lista de id_bloques
            // Iteramos sobre cada id de bloque de forma secuencial
            for (const b_id of tup[1]) {
                const dob = createDOB(order.id, b_id, tup[0]);
                dobs.push(dob)


                const actualBlock = allBlocks.find(blo => blo.id === b_id);
                if (actualBlock !== undefined) {
                    // Cargamos los precios asociados
                    //const prices_blockFounded = await actualBlock.prices.loadItems();
                    const prices_blockFounded = actualBlock.prices
                    let priceToAdd: number;

                    if (prices_blockFounded.length > 1) {
                        // Tomamos el último elemento usando el índice correcto
                        priceToAdd = prices_blockFounded[prices_blockFounded.length - 1].value;
                        //console.log('Precios del bloque: ', actualBlock.numBlock, 'es: $', priceToAdd);
                    } else {
                        priceToAdd = prices_blockFounded[0].value;
                        //console.log('El precio de la posicion 0 es: ', priceToAdd);
                    }

                    totalCost += priceToAdd;
                }
            }
        }
        order.days_orders_blocks?.add(dobs);
        order.totalCost = totalCost;
        em.persist(order)
        await em.flush()
        em.fork()
        const newOrder = await em.findOneOrFail(Order, order, { populate: ['days_orders_blocks'] })
        console.log('LA NUEVA ORDEN ES: ', newOrder)

        res.status(201).json({ message: 'Order created succesfully', data: newOrder })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}


async function update(req: Request, res: Response) {
    try {
        const id = req.params.id
        const order = em.getReference(Order, id)
        em.assign(order, req.body.sanitizeInput)
        await em.flush()
        res.status(200).json({ message: 'Order modificated succesfully', data: order })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
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

async function createTuples2(regStructure: BlocksRegularType, dateFrom: Date) {
    // reg = [monday:['1','2', '3'], tues:[id_block], wend:[],....]
    // structure = [[nroBloque, nroBloque],[],[]] 0->sunday , 1 -> monday ...

    let tuples: TupleBlocksType[] = []

    const structure = rewriteDaysArray(regStructure)
    //console.log('Llegue re lejos, ya rescribió el arreglo: ', structure)
    //verificamos los bloques.

    const nums = new Set<string>()

    //Construimos listas de ids.
    structure.forEach(week_day => {
        week_day.forEach(block_num => { nums.add(block_num) });
    });

    const numsCorrectos = await checkAll([...nums])
    const idsStructure: string[][] = await numsToIds(structure)

    if (numsCorrectos) { //si todos los bloques son correctos funciona.... 

        const lastDay = lastDayOfMonth(dateFrom)
        const daysOfMonth = eachDayOfInterval({ start: dateFrom, end: lastDay })
        daysOfMonth.forEach(day => {
            const dayNum = day.getDay()
            if (structure[dayNum].length > 0) {
                tuples.push([day, idsStructure[dayNum]])
            }
        });
    } else { console.log("Alguno de los bloques enviados no existe.") }


    return tuples

    // tuples = [Date, [id_block]]
}

async function createNotRegularTuples(notRegularStructure: [string, string[]][], dateFrom: Date) { //lista(date-string, numBlockList[])
    let tuples: TupleBlocksType[] = []

    const nums = new Set<string>()

    //Construimos listas de numeros de bloques pasados.
    notRegularStructure.forEach(tup => {
        tup[1].forEach(block_num => { nums.add(block_num) });
    });

    console.log('Esta es la lista de block nums', nums)

    //verificamos que todos los numeros pasados sean validos.
    const numsCorrectos = await checkAll([...nums])

    console.log('Todos son correctos o no: ', numsCorrectos)
    if (numsCorrectos) {
        let numBlocksList: string[][] = []
        //tipamos las tuplas con [Date,[ids]]

        const largo: number = notRegularStructure.length
        //creo una lista asociada por indice con la lista de nros.
        for (let index = 0; index < largo; index++) {
            numBlocksList[index] = notRegularStructure[index][1];
        }
        // ahora tengo una lista con los ids en los mismos indices que los blocksNums
        const idsStructure: string[][] = await numsToIds2(numBlocksList)

        //construimos las tuplas [date, idsArray][]
        for (let index = 0; index < largo; index++) {
            //verificamos de crear solo tuplas mayores a mañana
            const dia = new Date(notRegularStructure[index][0])

            if (compareAsc(dia, dateFrom) == -1) { // si = -1 dia esta antes que dateFrom por ende ya paso
                console.log('Los bloques asociados a la fecha', dia, 'son descartados por ser posteriores a hoy.')
            } else { //si la fecha es superior a mañana, se guardan como corresponde.
                //tuples[index] = [dia, idsStructure[index]];
                tuples.push([dia, idsStructure[index]])
            }
        }


    } else {
        console.log("Alguno de los bloques enviados no existe.")
        throw new Error('Los bloques enviados no existen');
    }

    console.log('Las tuplas son: ', tuples)
    return tuples //devuelve el arreglo vacio si no son correctos. 
}


function createDOB(o: string | undefined, b: string | undefined, d: Date) {
    //la orden ya existe. 
    if (b !== undefined && o !== undefined) {
        const newTern = em.create(DayOrderBlock, { day: d, block: b, order: o, })
        return newTern
    } else {
        console.log('No existe el metodo')
        const newTern = new DayOrderBlock()
        return newTern
    }
}


async function findWithRelations(req: Request, res: Response) {
    try {
        console.log('Entre al findWithRelations')
        const orders = await em.find(Order, {}, { populate: ['days_orders_blocks', 'days_orders_blocks.block', 'days_orders_blocks.block.prices.value', 'contract', 'spot'] })

        res.status(200).json({ message: 'Orders populated succesfully', data: orders })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}




export { sanitizeOrderInput, findAll, findOne, add, update, remove, findWithRelations }

// ORDEN REGULAR
// Bloques_regular = [[1,2,3,4], [1,2,3,4], [10,11,15,16], [10,11,15,16], [id_bloque], [], []]
// Bloques_regular = [[lunes], [martes], [miercoles], [jueves], [viernes], [sabado], [domingo]]
// bloques[lunes] = [1,2,4,5]
// en este caso regular = true, tengo que construir las ternarias del mes.

// Bloque_NO_regular[(2025-1-4, ["1","2","3","5"]), (YYYY/M/D, [numBlock,..,..,..]),.... ]
