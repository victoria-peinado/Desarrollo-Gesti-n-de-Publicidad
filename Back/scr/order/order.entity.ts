import { DateTimeType, Entity, ManyToOne, Rel, Property } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Contract } from "../contract/contract.entity.js";
import { Spot } from "../spot/spot.entity.js";

@Entity()
export class Order extends BaseEntity {
    @Property({nullable:true})
    numOrder?: string

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

     @ManyToOne( ()=> Contract)
     contract!: Rel<Contract>
     
     @ManyToOne( () => Spot)
     spot?: Rel<Spot> //lo pongo como cero por si no esta al momento de crearla

     //ManyToMany

}