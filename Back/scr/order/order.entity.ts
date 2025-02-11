import { DateTimeType, Entity, ManyToOne, Rel, Property, OneToMany, Collection } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Contract } from "../contract/contract.entity.js";
import { Spot } from "../spot/spot.entity.js";
import { ObjectIdSchema, BlocksRegularSchema, TupleBlocksSchema, BlocksRegularType } from '../shared/db/schemas.js';
import { object, z } from 'zod';
import { DayOrderBlock } from "../day_order_block/day_order_block.entity.js";

@Entity()
export class Order extends BaseEntity {
    //deberiamos fletar numOrden pues es id.
    @Property({nullable:true})
    numOrder?: string

    //regDate se genera al crear el objeto. 
    @Property({type: DateTimeType})
    regDate?= new Date() 

    @Property({nullable:true})
    totalAds?: number //calculado

    @Property({nullable:true})
    daysAmount?: number // calculado

     @Property({nullable:true})
     nameStrategy?: string

     @Property({nullable:true})
     totalCost?: number //calculado

     @Property({nullable:true})
     dailyCost?: number // calculado

     @Property({nullable:true})
     obs?: string

     @Property({nullable:true})
     showName?: string 

     @Property({nullable:false})
     liq: boolean = false

     @Property({nullable:false}) //Ver si puede ser calculado o no. Podria ser en funcion de la fecha de la anterio.
     month?: string // deberia ser MM-AAAA

     @Property({nullable: false})
     regular: boolean = true

     @Property({nullable: true})
     regStructure?: BlocksRegularType

     @Property({nullable: true})
     cancelDate?: Date

     @ManyToOne( ()=> Contract)
     contract!: Rel<Contract>
     
     @ManyToOne( () => Spot, { nullable: true })
     spot?: Rel<Spot> //lo pongo como cero por si no esta al momento de crearla

     @OneToMany(()=> DayOrderBlock, dayordenblock => dayordenblock.id)
     days_orders_blocks? = new Collection<DayOrderBlock>(this);

     //ManyToMany Deberiamos definir un nuevo objeto DIA-ORDEN-BLOQUE day_order_block{id_order, id_block, day} 

     //DEBERIAMOS TENER DOS NUEVOS ATRIBUTOS - BOOL QUE SI ES REGULAR - ARRAY DE LOS REGULARES. LISTO

     //AGREGAR CAMPO FECHA CANCELACION LISTO

}
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
  regStructure: BlocksRegularSchema,
  cancelDate: z.date().optional(),
  //notRegStructure: TupleBlocksSchema, //ROMPE TODO O VA?
  contract: ObjectIdSchema,
  spot: ObjectIdSchema.optional(),
});
export const PutOrderSchema = OrderSchema.omit({contract:true}); // Partial schema for updates
export const PatchOrderSchema = OrderSchema.omit({contract:true}).partial(); // Partial schema for updates

