import {Property,  Entity, DateTimeType, OneToMany, Collection,Cascade} from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Price } from '../price/price.entity.js';

@Entity()
export class Block extends BaseEntity{
    
    @Property({nullable: false, unique: true})
    numBlock!: string   

    @Property({nullable: false})
    startTime!: string
   
    @OneToMany(() => Price, price => price.block, { cascade: [Cascade.ALL], orphanRemoval: true })//ver asundos de dependencias y cascadas
    prices = new Collection<Price>(this)

}