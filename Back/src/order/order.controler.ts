import { NextFunction, Request, Response } from "express";;
import { orm } from "../shared/db/orm.js";
import { Order } from "./order.entity.js";
import { BlocksRegularType, TupleBlocksType, BlocksNotRegularType } from "./order.entity.js";
import { Contract } from "../contract/contract.entity.js";
import { eachDayOfInterval, lastDayOfMonth, format, compareAsc, addDays, differenceInCalendarDays, parse, startOfMonth, addMonths } from 'date-fns';
import { rewriteDaysArray } from "../shared/datesUtilities.js";
import { DayOrderBlock } from "../day_order_block/day_order_block.entity.js";
import { Block } from "../block/block.entity.js";
import { checkAll, numsToIds2 } from "../block/block.controler.js";


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
        let dateFrom = contract.dateFrom
        let dateTo = contract.dateTo

        const order = em.create(Order, req.body.sanitizeInput);
        await em.flush();

        //order = await asingAtributes(order, dateFrom, req, res)

        const regular: boolean = req.body.sanitizeInput.regular
        const regStructure: BlocksRegularType = req.body.sanitizeInput.regStructure
        const notRegStructure: BlocksNotRegularType = req.body.sanitizeInput.notRegStructure


        await asingAtributes(order, dateFrom, regular, regStructure, notRegStructure, dateTo)

        em.persist(order)
        await em.flush()

        res.status(201).json({ message: 'Order created succesfully', data: order })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}


async function asingAtributes(order: Order, dateFrom: Date, regular: boolean, regStructure: BlocksRegularType, notRegStructure: BlocksNotRegularType | undefined, dateTo: Date | undefined) {
    // Verificamos fecha inicio Orden.
    if (compareAsc(dateFrom, new Date()) == -1) { // si = -1 desde esta antes que hoy por ende ya paso
        dateFrom = addDays(new Date(), 1) // asignamos como inicio la fecha de mañana. 
        dateFrom.setHours(0, 0, 0, 0)
        console.log('Asignamos la fecha de mañana: ', dateFrom)
    }

    order.month = format(dateFrom, 'MM-yyyy')
    order.totalCost = 0


    if (order?._id === undefined) {
        throw new Error('Error al crear la orden. No tiene id');
    } else { order.id = order._id.toString() }


    let tuples: TupleBlocksType[] = []

    if (regular) {
        tuples = await createTuples2(regStructure, dateFrom, dateTo)
    } else {
        if (notRegStructure != undefined) {
            tuples = await createNotRegularTuples(notRegStructure, dateFrom, dateTo)
        }
    }

    //Calcular totalAds - daysAmount - month
    let totalAds = 0
    tuples.forEach(t => { totalAds = totalAds + t[1].length });
    order.totalAds = totalAds
    order.daysAmount = daysAmount(tuples)

    //calcular parametros
    const allBlocks = await em.find(Block, {}, { populate: ['prices', 'prices.value'] })
    let totalCost = 0;
    let precioPrueba = 0
    const dobs: DayOrderBlock[] = []

    // Iteramos sobre cada tupla

    //ids
    const ids: string[] = []

    for (const tup of tuples) {  // tup[0] es la fecha, tup[1] es la lista de id_bloques
        // Iteramos sobre cada id de bloque de forma secuencial
        for (const b_id of tup[1]) {
            const dob = createDOB(order.id, b_id, tup[0]);
            dobs.push(dob)

            //
            ids.push(b_id)
            //
            /*
            const actualBlock = allBlocks.find(blo => blo.id === b_id);
            if (actualBlock !== undefined) {
                // Cargamos los precios asociados
                const prices_blockFounded = actualBlock.prices
                let priceToAdd: number;

                if (prices_blockFounded.length > 1) {
                    // Tomamos el último elemento usando el índice correcto
                    priceToAdd = prices_blockFounded[prices_blockFounded.length - 1].value;
                } else {
                    priceToAdd = prices_blockFounded[0].value;
                }

                totalCost += priceToAdd;
            }
            */
        }
    }

    //
    totalCost = totalCostCalculete(ids, allBlocks)
    //
    order.days_orders_blocks?.add(dobs);
    order.totalCost = totalCost;

    return order
}

//calcula el costo de una orden desde una lista de ids, y de todos los bloques
function totalCostCalculete(ids: string[], allBlocks: Block[]) {

    let totalCost: number = 0
    for (const b_id of ids) {
        const actualBlock = allBlocks.find(blo => blo.id == b_id);
        if (actualBlock !== undefined) {
            // Cargamos los precios asociados
            const prices_blockFounded = actualBlock.prices
            let priceToAdd: number;

            if (prices_blockFounded.length > 1) {
                // Tomamos el último elemento usando el índice correcto
                priceToAdd = prices_blockFounded[prices_blockFounded.length - 1].value;
            } else {
                priceToAdd = prices_blockFounded[0].value;
            }

            totalCost += priceToAdd;
        }
    }
    return totalCost
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

//crea las tuplas desde la dateFrom o mañana, y hasta dateTo (inclusive) o el final del mes.
async function createTuples2(regStructure: BlocksRegularType, dateFrom: Date, dateTo: Date | undefined) {
    // reg = [monday:['1','2', '3'], tues:[id_block], wend:[],....]
    // structure = [[nroBloque, nroBloque],[],[]] 0->sunday , 1 -> monday ...

    let tuples: TupleBlocksType[] = []

    const structure = rewriteDaysArray(regStructure)
    //verificamos los bloques.

    const nums = new Set<string>()

    //Construimos listas de ids.
    structure.forEach(week_day => {
        week_day.forEach(block_num => { nums.add(block_num) });
    });

    const numsCorrectos = await checkAll([...nums])
    const idsStructure: string[][] = await numsToIds2(structure)

    if (numsCorrectos) { //si todos los bloques son correctos funciona.... 

        const lastDay: Date = dateToCalculate(dateFrom, dateTo)

        const daysOfMonth = eachDayOfInterval({ start: dateFrom, end: lastDay }) //ambos inclusives
        daysOfMonth.forEach(day => {
            const dayNum = day.getDay()
            if (structure[dayNum].length > 0) {
                tuples.push([day, idsStructure[dayNum]])
            }
        });
    } else {
        console.log("Alguno de los bloques enviados no existe.")
        throw new Error('Los bloques enviados no existen');
    }
    return tuples

    // tuples = [Date, [id_block]]
}

//crea las tuplas desde la dateFrom o mañana, y hasta dateTo (inclusive) o el final del mes.
async function createNotRegularTuples(notRegularStructure: BlocksNotRegularType, dateFrom: Date, dateTo: Date | undefined) { //lista(date-string, numBlockList[])
    let tuples: TupleBlocksType[] = []

    const nums = new Set<string>()

    //Construimos listas de numeros de bloques pasados.
    notRegularStructure.forEach(tup => {
        tup[1].forEach(block_num => { nums.add(block_num) });
    });


    //verificamos que todos los numeros pasados sean validos.
    const numsCorrectos = await checkAll([...nums])

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

            //dateFrom ya es la de mañana chequeada o la futura del contrato.
            // compareAsc(dateLeft, dateRight) retorna:
            //     -1 si dateLeft es menor que dateRight.
            //     0 si ambas fechas son iguales.
            //     1 si dateLeft es mayor que dateRight.

            if (compareAsc(dia, dateFrom) >= 0) { // si = 0 dia es igual o mayor a dateFrom

                //verificamos que la fecha no supere el hasta de la contratación o el ultimo día del mes.
                const lastDay: Date = dateToCalculate(dateFrom, dateTo)
                // si dia es igual o menor que lastDay (ultimo del mes o ultimo contratación)
                if (compareAsc(dia, lastDay) <= 0) {

                    tuples.push([dia, idsStructure[index]])

                } else { console.log('El dia ', dia, 'fue descartado por estar fuera de la contratacion o del mes de la orden.') }

            } else { //si la fecha es superior a mañana, se guardan como corresponde.
                console.log('Los bloques asociados a la fecha', dia, 'son descartados por ser anteriores a hoy.')
            }
        }


    } else {
        console.log("Alguno de los bloques enviados no existe.")
        throw new Error('Los bloques enviados no existen');
    }
    //console.log('Las tuplas son: ',tuples)
    return tuples //devuelve el arreglo vacio si no son correctos. 
}


function createDOB(o: string | undefined, b: string | undefined, d: Date) {
    //la orden ya existe. 
    if (b !== undefined && o !== undefined) {
        const newTern = em.create(DayOrderBlock, { day: d, block: b, order: o, })
        return newTern
    } else {
        //console.log('No existe el metodo')
        throw new Error('Alguna de las ID son Undefined');
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

function daysAmount(tuples: [Date, string[]][]) {
    const dates = tuples.map(([date]) => date);
    const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
    const diff = differenceInCalendarDays(maxDate, minDate)
    return diff
}

function dateToCalculate(dateFrom: Date, dateTo: Date | undefined) {
    let lastDay: Date
    //verificar dateTo
    if (dateTo != undefined) {
        if (dateTo.getMonth() == dateFrom.getMonth()) {
            // si este mes termina la contratación de esta orden
            lastDay = dateTo
        } else {
            // si no esta indefinido pero no es en este mes, el mes es entero
            lastDay = lastDayOfMonth(dateFrom)
        }

    } else {
        // la fecha hasta esta indefinida, quiere decir que este mes va entero
        lastDay = lastDayOfMonth(dateFrom)
    }
    return lastDay
}


async function renovateRegularOrders(actualMonth: string) {
    try {
        //podriamos pasar el mes anterior como parametro.
        const actualMonth = format((new Date()), 'MM-yyyy')
        const date = parse(actualMonth, "MM-yyyy", new Date());
        const firstDayNextMonth = startOfMonth(addMonths(date, 1));
        const ordersCreated: Order[] = []
        //Buscamos ordenes que ----no tengan fecha cancelación (pueden estar canceladas pero tener contratacion activa, por eso las dejamos. RN: Para eliminar la renovacion de una orden regular debe finalizarse la contratación.)----- y sean regulares.
        const orders = await em.find(Order, { month: actualMonth, regular: true }, { populate: ['contract.dateTo'] })

        for (let index = 0; index < orders.length; index++) {
            const actualOrder = orders[index];
            let validOrder: boolean = false
            //vemos que la dateTo no exista o este dentro de este mes, o este mas adelantes que este mes.
            if (actualOrder.contract.dateTo === undefined) {
                //creamos normal.
                validOrder = true
            } else {
                // si dateTo es antes que primerDia = -1 o si son iguales = 0.
                if (compareAsc(actualOrder.contract.dateTo, firstDayNextMonth) >= 0) {
                    //se crea todo el mes o hasta dateTo (segun corresponda).
                    validOrder = true
                }
            }

            // si las fechas son validas creamos la orden, sino la ignoramos. 
            if (validOrder) {
                const body = dataConstructor(actualOrder)
                const newOrder = em.create(Order, body)
                await em.flush();

                //order = await asingAtributes(order, dateFrom, req, res)

                if (newOrder.regStructure != undefined) {
                    await asingAtributes(newOrder, firstDayNextMonth, newOrder.regular, newOrder.regStructure, undefined, newOrder.contract.dateTo)
                } else {
                    throw new Error('Estructura regular sin definir');
                }

                em.persist(newOrder)
                ordersCreated.push(newOrder)

            }
        }
        await em.flush()
        console.log('Ordenes creadas con exito: ', ordersCreated)
        return ordersCreated

    } catch (error) { console.log('ALGO SE ROMPIO AL RENOVAR LAS ORDENES ', error) }
}


function dataConstructor(order: Order) {
    const data = {
        numOrder: undefined,
        regDate: new Date(),
        totalAds: undefined,
        daysAmount: undefined,
        nameStrategy: order.nameStrategy,
        totalCost: undefined,
        dailyCost: undefined,
        obs: order.obs,
        showName: order.showName,
        liq: false,
        month: undefined,
        regular: true,
        regStructure: order.regStructure,
        cancelDate: undefined,
        notRegStructure: undefined,
        contract: order.contract,
        spot: order.spot
    }
    return data
}

async function testRenovarOrdenes(req: Request, res: Response) {
    try {
        const actualMonth = format((new Date()), 'MM-yyyy')
        const date = parse(actualMonth, "MM-yyyy", new Date());
        const firstDayNextMonth = startOfMonth(addMonths(date, 1));
        const nextMonthString = format(firstDayNextMonth, 'MM-yyyy')
        const ordersCreated = await renovateRegularOrders(nextMonthString)
        console.log('Ordenes creadas con exito: ', ordersCreated)
        res.status(200).json({ message: 'Ordenes creadas con exito', data: ordersCreated })

    } catch (error: any) { res.status(500).json({ message: error.message }) }
}

function daysAmountFromDOB(lista: DayOrderBlock[]): number {
    const dias = new Set<string>();
    //usamos string para evitar algun problema con la hora (que no deberia existir)

    for (const dob of lista) {
        const fecha = dob.day;
        const diaString = format(fecha, 'yyyy-MM-dd');
        dias.add(diaString);
    }
    return dias.size;
}


async function cancelOrder(req: Request, res: Response) {
    try {
        //definir si lo ponemos en los parametros o en el body.sanitizeInput.
        const id = req.params.id
        const order = await em.findOneOrFail(Order, { id })
        const remover: DayOrderBlock[] = []
        if (order.cancelDate === undefined) {
            let cancelDate: string | Date = req.body.sanitizeInput.cancelDate
            if ( typeof(cancelDate) == "string"){
                cancelDate = parse(cancelDate, 'yyyy-MM-dd', new Date())
                cancelDate.setHours(0, 0, 0, 0);
            }
            //RN: Solo se puede cancelar a partir de mañana.
            if (compareAsc(cancelDate, new Date()) <= 0) {
                //si la fecha de cancelación es hoy o anterior a hoy.
                const hoy = new Date();
                cancelDate = new Date(hoy);
                cancelDate.setDate(hoy.getDate() + 1)
                cancelDate.setHours(0, 0, 0, 0)
            }

            const cancelMonth = format(cancelDate, 'MM-yyyy')

            if (order.month === cancelMonth) {
                order.cancelDate = cancelDate
                if (order.obs === undefined) { order.obs = '' }
                order.obs = order.obs + '\n \n Info de Cancelación: \n' + req.body.sanitizeInput.obs
                let ternarias = await order.days_orders_blocks?.loadItems()
                if (ternarias === undefined) { ternarias = [] } //para que no se queje.
                //popular y borrar todos los objetos DayOrderBlock que esten entre ese dia y el ultimo del mes. 
                const ids_validas: string[] = [] //no se le asigna un tipo de dato....
                ternarias.forEach(tern => {
          
                    //si es mayor a la fecha de cancelación se elimina ese objeto.
                    if (compareAsc(tern.day, cancelDate) >= 0) {
                        remover.push(tern)
                    } else {
                        //si el objeto se queda en la orden guardamos el id.
                        if (tern.block._id != undefined) {
                            ids_validas.push(tern.block._id.toString())
                        }
                    }
                });

                //recalcular los atributos......

                const allBlocks = await em.find(Block, {}, { populate: ['prices', 'prices.value'] })
                let totalCost = 0;

                totalCost = totalCostCalculete(ids_validas, allBlocks)
                order.totalCost = totalCost

                em.remove(remover)
                order.days_orders_blocks?.remove(remover)
                order.totalAds = order.days_orders_blocks?.length
                if (order.days_orders_blocks != undefined) {
                    order.daysAmount = daysAmountFromDOB(order.days_orders_blocks.getItems())
                }


                em.persist(order)

                const data = {
                    cancelDate: cancelDate,
                    cancelOrder: order,
                    removedRelations: remover,
                }

                await em.flush()
                res.status(200).json({ message: 'Order canceled sucsesfully', data: data })


            } else { throw new Error('El mes de la orden no es el mismo que el de la fecha de cancelación.') }
        }
        else {
            throw new Error('La orden ya ha sido cancelada')
        }

    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}


export { sanitizeOrderInput, findAll, findOne, add, update, remove, findWithRelations, renovateRegularOrders, testRenovarOrdenes, cancelOrder }

// ORDEN REGULAR
// Bloques_regular = [[1,2,3,4], [1,2,3,4], [10,11,15,16], [10,11,15,16], [id_bloque], [], []]
// Bloques_regular = [[lunes], [martes], [miercoles], [jueves], [viernes], [sabado], [domingo]]
// bloques[lunes] = [1,2,4,5]
// en este caso regular = true, tengo que construir las ternarias del mes.

// Bloque_NO_regular[(2025-1-4, ["1","2","3","5"]), (YYYY/M/D, [numBlock,..,..,..]),.... ]
