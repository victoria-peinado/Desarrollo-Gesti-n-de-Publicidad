// shop.entity.ts

import {Entity, Property, DateTimeType, OneToMany, ManyToOne, Collection, Rel} from '@mikro-orm/core'
import { Contact } from '../contact/contact.entity.js';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Contract } from '../contract/contract.entity.js';
import { Owner, FiscalCondition } from '../owner/owner.entity.js';
import {ObjectIdSchema} from '../shared/db/schemas.js';
import { z } from 'zod';

@Entity()
export class Shop extends BaseEntity{
   

    @Property({type: DateTimeType})
    regDate? = new Date()

    @Property({nullable:false})     
    fantasyName!: string
    
    @Property({nullable:false})    
    address!: string
    
    @Property({nullable:false})    
    billingType!: string //condicionfiscal. fiscalCondition

    @Property({nullable: false})    
    mail!: string

    @Property({nullable: true})    
    usualPaymentForm?: string

    @Property({nullable: true})    
    type?: string
   
    //@Property({nullable: true}) //no esta en el modelo de la vista. 
    //numShop?: number //ver como hacer autoincremental.

    @OneToMany(() => Contract, contract => contract.shop) //ver asundos de dependencias y cascadas
    contracts = new Collection<Contract>(this)

    @ManyToOne( () => Contact)
    contact!: Rel<Contact>
    
    @ManyToOne( () => Owner)
    owner!: Rel<Owner>

    
}

enum PaymentMethod {
  Efectivo = "Efectivo",
  TarjetaDeCredito = "Tarjeta de Crédito",
  TarjetaDeDebito = "Tarjeta de Débito",
  Cheque = "Cheque",
  Otro = "Otro",
}

export const ShopSchema = z.object({
  regDate: z.date().optional(), // Registration date, optional with a default value
  fantasyName: z.string().min(1, { message: "Fantasy name is required" }), // Fantasy name, cannot be empty
  address: z.string().min(1, { message: "Address is required" }), // Address, cannot be empty
  billingType: z.nativeEnum(FiscalCondition), // Fiscal condition, validated against the FiscalCondition enum
  mail: z.string().email({ message: "Invalid email address" }), // Email, must be valid
  usualPaymentForm: z.nativeEnum(PaymentMethod).optional(), // Usual payment method, optional and validated against PaymentMethod enum
  type: z.string().optional(), // Shop type, optional
  contact: ObjectIdSchema, // Contact ID, must be a valid ObjectId
  owner: ObjectIdSchema, // Owner ID, must be a valid ObjectId
});
export const ShopPutSchema = ShopSchema.omit({ regDate: true, contact:true, owner:true }); // Schema for full updates
export const PartialShopSchema = ShopPutSchema.partial(); // Partial schema for updates