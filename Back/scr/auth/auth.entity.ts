import {Property,  Entity,Enum, DateTimeType, OneToMany, Collection,Cascade} from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import {z} from 'zod';
import { Price } from '../price/price.entity.js';
import e from 'express';

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

// User Validation Schema
export const UserSchema = z.object({
  username: z.string().min(1, "Username is required and cannot be empty."),
  password: z.string().min(1, "Password is required and cannot be empty."),
  role: z.nativeEnum(UserRole), // Ensures `role` is required and must be a valid UserRole value
});
export const LoginSchema = z.object({
  username: z.string().min(1, "Username is required."),
  password: z.string().min(1, "Password is required and cannot be empty."),
});
export const PartialUserSchema = UserSchema.partial();