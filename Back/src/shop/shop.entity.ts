// shop.entity.ts

import {Entity, Property, DateTimeType, OneToMany, ManyToOne, Collection, Rel} from '@mikro-orm/core'
import { Contact } from '../contact/contact.entity.js';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Contract } from '../contract/contract.entity.js';
import { Owner, FiscalCondition } from '../owner/owner.entity.js';
import {ObjectIdSchema} from '../shared/db/schemas.js';
import { z } from 'zod';


interface Address{
  street: string,
  number: string,
  level: string, 
  department: string,
  postalCode: string,
  city: string,
  province: string
}


@Entity()
export class Shop extends BaseEntity{
   

    @Property({type: DateTimeType})
    regDate? = new Date()

    @Property({nullable:false})     
    fantasyName!: string
    
    @Property({nullable:false})    
    address!: Address
    
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

export enum PaymentMethod {
  Efectivo = "Efectivo",
  TarjetaDeCredito = "Tarjeta de Crédito",
  TarjetaDeDebito = "Tarjeta de Débito",
  Cheque = "Cheque",
  Transferencia= "Transferencia",
  Otro = "Otro",
}

export enum billingType {
  FacturaA = "Factura A",
  FacturaB = "Factura B",
  SinFactura = "Sin Factura", 
}
export enum ShopType {
  Empresa= 'Empresa',
  PyM='PyME',
  Minorista='Minorista',
  Mayorista='Mayorista',
  Distribudor='Distribuidor',
  Otro='Otro'
}

  

export const AdressSchema = z.object({
  street: z.string().min(1, { message: 'Street Name is required' }),
  number: z.string().optional(),
  level: z.string().optional(),
  department: z.string().optional(),
  postalCode: z.string().min(1, { message: 'Postal Code must have four numbers.'}),
  city: z.string(),
  province: z.string().optional()
})
export const SimpleAdressSchema = z.string().regex(/^.*\s\d+$/, { message: 'Address must contain a space followed by a number' });
export const ShopSchema = z.object({
  regDate: z.date().optional(), // Registration date, optional with a default value
  fantasyName: z.string().min(1, { message: "Fantasy name is required" }), // Fantasy name, cannot be empty

  billingType: z.nativeEnum(billingType), // Fiscal condition, validated against the FiscalCondition enum
  mail: z.string().email({ message: "Invalid email address" }), // Email, must be valid
  usualPaymentForm: z.nativeEnum(PaymentMethod), // Usual payment method, optional and validated against PaymentMethod enum
  type: z.nativeEnum(ShopType), // Shop type, optional
  contact: ObjectIdSchema, // Contact ID, must be a valid ObjectId
  owner: ObjectIdSchema, // Owner ID, must be a valid ObjectId
  address: SimpleAdressSchema, // Address, cannot be empty

});
export const ShopPutSchema = ShopSchema.omit({ regDate: true, contact:true, owner:true }); // Schema for full updates
export const PartialShopSchema = ShopPutSchema.partial(); // Partial schema for updates