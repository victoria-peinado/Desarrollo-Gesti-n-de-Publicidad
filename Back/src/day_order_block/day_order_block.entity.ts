import { Entity, ManyToOne, Property, Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Block } from "../block/block.entity.js";
import { Order } from "../order/order.entity.js";
import { z } from "zod";


@Entity()
export class DayOrderBlock extends BaseEntity {

    @Property()
    day!: Date;

    //inversedBy lo define como "dueño" de la relación. 
    /*
    @ManyToOne(()=>Block, { inversedBy: 'days_orders_blocks'})
    block!: Rel<Block>

    @ManyToOne(()=>Order, { inversedBy: 'days_orders_blocks' })
    order!: Rel<Order>
    */

    @ManyToOne(() => Block)
    block!: Rel<Block>

    @ManyToOne(() => Order)
    order!: Rel<Order>

}

