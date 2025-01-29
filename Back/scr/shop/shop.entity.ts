// shop.entity.ts

import {Entity, Property, DateTimeType, OneToMany, ManyToOne, Collection, Rel} from '@mikro-orm/core'
import { Contact } from '../contact/contact.entity.js';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Contract } from '../contract/contract.entity.js';
import { Owner } from '../owner/owner.entity.js';
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


export const ShopSchema = z.object({//TODO
  id: z.number().int().positive(),
  name: z.string().min(1, "El nombre es obligatorio"),
  location: z.string().min(1, "La ubicación es obligatoria"),
});