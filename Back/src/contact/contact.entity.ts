// contact.entity.ts

import {Collection, Property, OneToMany, Entity, Cascade} from '@mikro-orm/core'
import { Shop , ShopSchema} from '../shop/shop.entity.js';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { z } from 'zod';

@Entity()
export class Contact extends BaseEntity{

  @Property({nullable:false})
  name!: string

  @Property({nullable:false})
  lastname!: string

  @Property({nullable:false, unique: true})
  dni!: string

  @Property({nullable:false})
  contacts!: string[]

 @OneToMany(() => Shop, shop => shop.contact
    //, {cascade: [Cascade.ALL]} //revisar asundo de persistencias. 
    )
  shops = new Collection<Shop>(this)
}


const phoneRegex = /^(?:(?:00)?549?)?0?(?:11|[2368]\d{1,3})\d{6,7}$/;

export const ContactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  lastname: z.string().min(1, "Lastname is required"),
  dni: z.string()
    .length(8, "DNI must be exactly 8 digits long")
    .regex(/^\d{8}$/, "DNI must consist of 8 digits without dots"),
  contacts: z.array(z.string().min(1, "Contact cannot be empty")).nonempty("Contacts array cannot be empty")
   .nonempty("Contacts array cannot be empty")
   .refine((contacts) => contacts.every((contact) => {
      const isPhoneNumber = phoneRegex.test(contact);
      const isEmail = z.string().email().safeParse(contact).success;
      return isPhoneNumber || isEmail;
    }), {
      message: "Each contact must be a valid phone number or email address",
    }),
  //shops: z.array(ShopSchema).optional(), // Valida la relación con Shop
});
export const ParcialContactSchema = ContactSchema.partial(); // Schema for partial updates