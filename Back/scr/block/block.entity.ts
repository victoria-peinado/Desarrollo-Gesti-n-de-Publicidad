import {Property,  Entity, DateTimeType, OneToMany, Collection,Cascade} from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Price, PriceSchema} from '../price/price.entity.js';
import { isNumBlockUnique } from './block.controler.js';
import { z } from 'zod';

@Entity()
export class Block extends BaseEntity{
    
    @Property({nullable: false, unique: true})
    numBlock!: string   

    @Property({nullable: false})
    startTime!: string
   
    @OneToMany(() => Price, price => price.block, { cascade: [Cascade.ALL], orphanRemoval: true })//ver asundos de dependencias y cascadas
    prices = new Collection<Price>(this)

}

// Define the BlockSchema, reusing PriceSchema
export const BlockSchema = z.object({
  numBlock: z
    .string()
    .min(1, "numBlock is required")
    .max(100, "numBlock cannot exceed 100 characters")
    .regex(/^\d+$/, "numBlock must be a valid number"),// Ensure numBlock is a valid number
  startTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, "startTime must be in the format HH:mm:ss"), // Validate HH:mm:ss format
  prices: z.array(PriceSchema).optional(), // Use PriceSchema for prices
});
export const ParcialBlockSchema = BlockSchema.partial(); // Schema for partial updates