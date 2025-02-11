import { orm } from "../shared/db/orm.js";
import { DayOrderBlock } from "./day_order_block.entity.js";

const em = orm.em
em.getRepository(DayOrderBlock)

function createRelations(): void {
    
}

export {createRelations}