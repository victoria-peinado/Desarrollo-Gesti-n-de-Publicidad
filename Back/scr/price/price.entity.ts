import { Property, Rel, Entity, DateTimeType,  ManyToOne} from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Block } from '../block/block.entity.js';
import { z } from 'zod';

@Entity()
export class Price extends BaseEntity{

  @Property({nullable:false}) 
  value!: number              

  @Property({type: DateTimeType, nullable:false})
  regDate = new Date()

  @ManyToOne(() => Block,{ nullable: false })
  block!: Rel<Block> 
}

export const PriceSchema = z.object({ //TODO
  amount: z.number().min(0, "Price amount must be positive"),
  currency: z.string().min(1, "Currency is required"),
});