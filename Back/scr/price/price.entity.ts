import { Property, Rel, Entity, DateTimeType,  ManyToOne} from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Block } from '../block/block.entity.js';

@Entity()
export class Price extends BaseEntity{

  @Property({nullable:false}) 
  value!: number              

  @Property({type: DateTimeType, nullable:false})
  regDate = new Date()

  @ManyToOne(() => Block,{ nullable: false })
  block!: Rel<Block> 
}

