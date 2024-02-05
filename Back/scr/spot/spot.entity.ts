import { Property, Rel, Entity, DateTimeType,  ManyToOne, OneToMany, Collection} from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Order } from '../order/order.entity.js';

@Entity()
export class Spot extends BaseEntity{

  @Property({nullable:false}) 
  long!: number              

  @Property({type: DateTimeType})
  regDate = new Date()

  @Property({nullable:false})
  name!: string

  @OneToMany(() => Order, order => order.spot)
  orders = new Collection<Order>(this) 
}

