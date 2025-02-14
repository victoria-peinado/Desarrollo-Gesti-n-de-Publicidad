// baseEntity.entity.ts

import { PrimaryKey, SerializedPrimaryKey} from "@mikro-orm/core"
import { ObjectId } from "@mikro-orm/mongodb"
import { serialize } from "v8"


export abstract class BaseEntity {
    @PrimaryKey()
    _id?: ObjectId = new ObjectId()

    @SerializedPrimaryKey()
    id?: string

    
    /*
    @Property ({tupe: DateTimeType})
    createdAt? = new Date()
    */
}