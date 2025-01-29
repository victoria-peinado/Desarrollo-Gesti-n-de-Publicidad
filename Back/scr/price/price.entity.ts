import { Property, Rel, Entity, DateTimeType,  ManyToOne} from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Block } from '../block/block.entity.js';
import { z } from 'zod';
import { ObjectIdSchema } from '../shared/db/schemas.js';
import e from 'express';

@Entity()
export class Price extends BaseEntity{

  @Property({nullable:false}) 
  value!: number              

  @Property({type: DateTimeType, nullable:false})
  regDate = new Date()

  @ManyToOne(() => Block,{ nullable: false })
  block!: Rel<Block> 
}
export const PriceSchema = z.object({
  value: z
    .number()
    .min(0, { message: 'Value must be a non-negative number' })
    .refine(value => !isNaN(value), { message: 'Value must be a valid number' }),
  block: ObjectIdSchema,
});
export const PriceAllSchema = PriceSchema.omit({ block: true });
// export const PriceAllSchema = z.object({
//   value: z
//     .number()
//     .min(0, { message: 'Value must be a non-negative number' })
//     .refine(value => !isNaN(value), { message: 'Value must be a valid number' }),
// });
export const PartialPriceSchema = PriceSchema.partial();