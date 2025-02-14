import { Property, Rel, Entity, DateTimeType,  ManyToOne, OneToMany, Collection} from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Order } from '../order/order.entity.js';
//import { OrderSchema } from '../order/order.entity.js';
import { z } from 'zod';

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

export const SpotSchema = z.object({
long: z
    .number()
    .int({ message: 'Longitude must be an integer' })
    .min(1, { message: 'Longitude must be greater than zero' }),
  // regDate: z.date().refine(value => !isNaN(value.getTime()), {
  //   message: 'Registration date must be a valid date',
  // }).optional(),
  name: z.string().min(1, {
    message: 'Name is required',
  }),
  //orders: z.array(OrderSchema).optional(),
});

export const ParcialSpotSchema = SpotSchema.partial();