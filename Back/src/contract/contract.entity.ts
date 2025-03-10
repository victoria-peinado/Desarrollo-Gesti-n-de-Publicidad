// contract.entity.ts

import {Property, ManyToOne, DateTimeType, Entity, Rel, OneToMany, Collection} from '@mikro-orm/core';
import { Shop } from '../shop/shop.entity.js';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Order } from '../order/order.entity.js';
import { ObjectIdSchema } from '../shared/db/schemas.js';
import { z } from 'zod';
import e from 'express';

@Entity()
export class Contract extends BaseEntity{
    
   // @Property()
   // numContract!: string   //ver como hacer funcionar autoncremental.
 
    @Property({type: DateTimeType})
    regDate? = new Date()

    @Property({type: DateTimeType, nullable: false})
    dateFrom!: Date  

    @Property({type: DateTimeType, nullable:true})
    dateTo?: Date   

    @Property({nullable: true})
    observations?: string

    @ManyToOne(() => Shop, {nullable: false})
    shop!: Rel<Shop>

    @OneToMany(() => Order, order => order.contract) //revisar asunto de persistencias
    orders = new Collection<Order>(this)

}


export const ContractSchema = z.object({
  regDate: z.coerce.date().optional(),
  dateFrom: z.coerce.date(),
  dateTo: z.coerce.date().optional(),
  observations: z.string().optional(),
  shop: ObjectIdSchema,
//   orders: z.array(
//     z.object({
//       // Definir el esquema para la relación con Order aquí
//     })
//   ).optional(),
});

export const PatchContractSchema = z.object({
  dateTo: z.coerce.date().optional(),
  observations: z.string().optional(),

});
export const PutContractSchema = ContractSchema.omit({shop:true}).partial(); // Partial schema for updates
