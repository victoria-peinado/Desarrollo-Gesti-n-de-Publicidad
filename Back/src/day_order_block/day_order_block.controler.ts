import { orm } from "../shared/db/orm.js";
import { DayOrderBlock } from "./day_order_block.entity.js";

const em = orm.em
em.getRepository(DayOrderBlock)

async function createNewDOB(o: string | undefined, b: string | undefined, d: Date) {
    //la orden ya existe. 
    if (b !== undefined && o !== undefined) {
        const newTern = em.create(DayOrderBlock, { day: d, block: b, order: o, })
        await em.flush()
        return newTern
    } else { console.log('No existe el metodo') }
}



export { createNewDOB }