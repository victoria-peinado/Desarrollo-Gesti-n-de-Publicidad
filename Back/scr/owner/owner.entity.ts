import {Collection, Property, OneToMany, Entity} from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Shop,ShopSchema } from '../shop/shop.entity.js';
import { validCuit } from '../shared/db/middleware.js';
import { z } from 'zod';
@Entity()
export class Owner extends BaseEntity{

  @Property({nullable:false, unique: true}) //PREGUNTAR POR ME PERMITE CREARLO DOS CLASES CON IGUAL CUIT.
  cuit!: string                             //el UNIQUE solo funciona con SQL. Como validarlo en MONGODB

  @Property({nullable:false})
  businessName!: string

  @Property({nullable:false})
  fiscalCondition!: string


 @OneToMany(() => Shop, shop => shop.owner
    //, {cascade: [Cascade.ALL]} //revisar asundo de persistencias. 
    )
  shops = new Collection<Shop>(this)
}


export const OwnerSchema = z.object({
  cuit: z
    .string()
    .length(11, 'CUIT must be exactly 11 digits')
    .refine(validCuit, 'Invalid CUIT'),
  businessName: z.string().min(1, 'Business name is required'),
  fiscalCondition: z.string().min(1, 'Fiscal condition is required'),
  //shops: z.array(ShopSchema).optional()
});
export const ParcialOwnerSchema = OwnerSchema.partial();