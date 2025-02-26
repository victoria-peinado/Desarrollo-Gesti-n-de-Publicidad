import { DateTimeType, Entity, ManyToOne, Rel, Property, OneToMany, Collection } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Contract } from "../contract/contract.entity.js";
import { Spot } from "../spot/spot.entity.js";
import { ObjectIdSchema, NumBlockSchema } from '../shared/db/schemas.js';
import { object, string, z } from 'zod';
import { DayOrderBlock } from "../day_order_block/day_order_block.entity.js";
import { format } from "date-fns";

@Entity()
export class Order extends BaseEntity {
  //deberiamos fletar numOrden pues es id.
  @Property({ nullable: true })
  numOrder?: string

  //regDate se genera al crear el objeto. 
  @Property({ type: DateTimeType })
  regDate = new Date()

  @Property({ nullable: true })
  totalAds?: number //calculado

  @Property({ nullable: true })
  daysAmount?: number // calculado

  @Property({ nullable: true })
  nameStrategy?: string

  @Property({ nullable: true })
  totalCost?: number //calculado

  @Property({ nullable: true })
  dailyCost?: number // calculado

  @Property({ nullable: true })
  obs?: string

  @Property({ nullable: true })
  showName?: string

  @Property({ nullable: false })
  liq: boolean = false

  @Property({ nullable: false }) //Ver si puede ser calculado o no. Podria ser en funcion de la fecha de la anterio.
  month?: string = format(this.regDate,'MM-yyyy') // deberia ser MM-AAAA
  //por el momento lo dejo así para no cambiar la creación. De todas maneras siempre se reasigna el valor. Sino debería ponerlo como nulable.

  @Property({ nullable: false })
  regular: boolean = true

  @Property({ nullable: true })
  regStructure?: BlocksRegularType

  @Property({ nullable: true })
  cancelDate?: Date

  @ManyToOne(() => Contract)
  contract!: Rel<Contract>

  @ManyToOne(() => Spot, { nullable: true })
  spot?: Rel<Spot> //lo pongo como cero por si no esta al momento de crearla

  @OneToMany(() => DayOrderBlock, dayordenblock => dayordenblock.order)
  days_orders_blocks? = new Collection<DayOrderBlock>(this);


}

const BlocksRegularSchema = z.object({
  monday: z.array(NumBlockSchema),
  tuesday: z.array(NumBlockSchema),
  wednesday: z.array(NumBlockSchema),
  thursday: z.array(NumBlockSchema),
  friday: z.array(NumBlockSchema),
  saturday: z.array(NumBlockSchema),
  sunday: z.array(NumBlockSchema),
});


const TupleBlocksSchema = z.tuple([z.date(), z.array(NumBlockSchema)]);

const TupleBlocksSchemaReq = z.tuple([z.string(), z.array(NumBlockSchema)]);

const BlocksNotRegularSchema = z.array(TupleBlocksSchemaReq)

type BlocksNotRegularType = z.infer<typeof BlocksNotRegularSchema>

type BlocksRegularType = z.infer<typeof BlocksRegularSchema>

type TupleBlocksType = z.infer<typeof TupleBlocksSchema>

type TupleBlocksReqType = z.infer<typeof TupleBlocksSchemaReq>



export const OrderSchema = z.object({
  numOrder: z.string().min(1, { message: 'numOrder no puede estar vacío' }).optional(),
  regDate: z.date().default(() => new Date()),
  totalAds: z.number().int().positive({ message: 'totalAds debe ser un número entero mayor que cero' }).optional(),
  daysAmount: z.number().int().positive({ message: 'daysAmount debe ser un número entero mayor que cero' }).optional(),
  nameStrategy: z.string().min(1, { message: 'nameStrategy no puede estar vacío' }).optional(),
  totalCost: z.number().positive({ message: 'totalCost debe ser mayor que cero' }).optional(),
  dailyCost: z.number().positive({ message: 'dailyCost debe ser mayor que cero' }).optional(),
  obs: z.string().min(1, { message: 'obs no puede estar vacío' }).optional(),
  showName: z.string().min(1, { message: 'showName no puede estar vacío' }).optional(),
  liq: z.boolean().default(false),
  month: z.string().regex(/^\d{2}-\d{4}$/, { message: 'month debe tener el formato MM-AAAA' }).optional(),
  regular: z.boolean().default(true),
  regStructure: BlocksRegularSchema.optional(),
  cancelDate: z.date().optional(),
  notRegStructure: BlocksNotRegularSchema.optional(), //ROMPE TODO O VA?
  contract: ObjectIdSchema,
  spot: ObjectIdSchema.optional(),
});

export const CancelOrderSchema = z.object({
  id: ObjectIdSchema.optional(),
  cancelDate: z.date({ required_error: 'La fecha de cancelación es obligatoria' }).or(z.string().regex(/^\d{4}-\d{1,2}-\d{1,2}$/, 'Formato de fecha inválido (yyyy-m-d o yyyy-mm-dd)')), //default(()=> new Date()), //podriamos poner la fecha de hoy como default. 
  obs: z.string().min(1, { message: 'obs no puede estar vacío' }).optional(),
})


export { BlocksRegularSchema, TupleBlocksSchema, BlocksRegularType, TupleBlocksType, TupleBlocksReqType, TupleBlocksSchemaReq, BlocksNotRegularType }

export const PutOrderSchema = OrderSchema.omit({ contract: true }); // Partial schema for updates
export const PatchOrderSchema = OrderSchema.omit({ contract: true }).partial(); // Partial schema for updates

