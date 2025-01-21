import { MikroORM } from "@mikro-orm/core";
import { MongoHighlighter } from "@mikro-orm/mongo-highlighter";
import { config } from "dotenv";

//env variables
config()
const databaseName = process.env.DATABASE_NAME;
const databaseUrl = process.env.CONNECTION_STRING;


export const orm = await MikroORM.init({
    entities: ['dist/*/*.entity.js'],
    entitiesTs: ['src/*/*.entity.ts'],
    dbName: databaseName,
    type: 'mongo',
    clientUrl: databaseUrl,
    highlighter: new MongoHighlighter(),
    debug: true,
})

export const syncShema =async () => {//no se usa en mango
    const generator = orm.getSchemaGenerator()
     /*
    await generator.dropSchema()
    await generator.createSchema()
    */
    await generator.updateSchema()    
}