import {Property,  Entity,Enum, DateTimeType, OneToMany, Collection,Cascade} from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Price } from '../price/price.entity.js';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}


@Entity()
export class User extends BaseEntity{
    
    @Property({nullable: false, unique: true})
    username!: string   

    @Property({nullable: false})
    password!: string
   
   @Enum(() => UserRole) // Especifica que este campo usa el enum UserRole
   role!: UserRole;

}