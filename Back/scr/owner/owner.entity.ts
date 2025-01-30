import {Collection, Property, OneToMany, Entity} from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Shop,ShopSchema } from '../shop/shop.entity.js';
import {CuitSchema }from '../shared/db/schemas.js';
import { z } from 'zod';
@Entity()
export class Owner extends BaseEntity{

  @Property({nullable:false, unique: true}) //PREGUNTAR POR ME PERMITE CREARLO DOS CLASES CON IGUAL CUIT.
  cuit!: string                             //el UNIQUE solo funciona con SQL. Como validarlo en MONGODB

  @Property({nullable:false})
  businessName!: string

  @Property({nullable:false})
  fiscalCondition!: string


 @OneToMany(() => Shop, shop => shop.owner
    //, {cascade: [Cascade.ALL]} //revisar asundo de persistencias. 
    )
  shops = new Collection<Shop>(this)
}

export enum FiscalCondition {
  RESPONSABLE_INSCRIPTO = 'Responsable Inscripto',
  CONSUMIDOR_FINAL = 'Consumidor Final',
  MONOTRIBUTISTA = 'Monotributista',
  IVA_EXENTO = 'IVA Exento',
  SUJETO_NO_CATEGORIZADO = 'Sujeto No Categorizado',
  EXENTO = 'Exento',
  SUJETO_EXTRANJERO = 'Sujeto Extranjero',
  AGENTE_DE_PERCEPCION = 'Agente de Percepción',
  AGENTE_DE_RETENCION = 'Agente de Retención',
  NO_ALCANZADO_POR_IVA = 'No Alcanzado por IVA',
  MONOTRIBUTISTA_SOCIAL = 'Monotributista Social',
  AUTONOMO = 'Autónomo',
  OTRO = 'Otro',
}

export const OwnerSchema = z.object({
  cuit: CuitSchema,
  businessName: z.string().min(1, 'Business name is required'),
  fiscalCondition: z.nativeEnum(FiscalCondition),
  //shops: z.array(ShopSchema).optional()
});
export const ParcialOwnerSchema = OwnerSchema.partial();