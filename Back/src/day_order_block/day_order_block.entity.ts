import { Entity, OneToMany, OneToOne, Property, Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Block } from "../block/block.entity.js";
import { Order } from "../order/order.entity.js";


@Entity()
export class DayOrderBlock extends BaseEntity {

    @Property()
    day!: Date;
    
 

}