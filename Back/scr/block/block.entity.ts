import {Property,  Entity, DateTimeType, OneToMany, Collection,Cascade} from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Price, PriceSchema} from '../price/price.entity.js';
import { isNumBlockUnique } from './block.controler.js';
import { z } from 'zod';
import { NumBlockSchema } from '../shared/db/schemas.js';
import { DayOrderBlock } from '../day_order_block/day_order_block.entity.js';

@Entity()
export class Block extends BaseEntity{
    
    @Property({nullable: false, unique: true})
    numBlock!: string   

    @Property({nullable: false})
    startTime!: string
   
    @OneToMany(() => Price, price => price.block, { cascade: [Cascade.ALL], orphanRemoval: true })//ver asundos de dependencias y cascadas
    prices = new Collection<Price>(this)

     @OneToMany(()=> DayOrderBlock, dayordenblock => dayordenblock.id)
     days_orders_blocks = new Collection<DayOrderBlock>(this);

}

// Define the BlockSchema, reusing PriceSchema
export const BlockSchema = z.object({
  numBlock: NumBlockSchema,
  startTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, "startTime must be in the format HH:mm:ss"), // Validate HH:mm:ss format
  prices: z.array(PriceSchema).optional(), // Use PriceSchema for prices
});
export const ParcialBlockSchema = BlockSchema.partial(); // Schema for partial updates