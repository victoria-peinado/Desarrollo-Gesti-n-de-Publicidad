import {Collection, Property, OneToMany, Entity} from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Shop } from '../shop/shop.entity.js';

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

