// contact.entity.ts

import {Collection, Property, OneToMany, Entity, Cascade} from '@mikro-orm/core'
import { Shop } from '../shop/shop.entity.js';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';

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

