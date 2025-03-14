import { MikroORM } from "@mikro-orm/core";
import { MongoHighlighter } from "@mikro-orm/mongo-highlighter";
import { env} from '../../config_env/config.js';


//env variables
const databaseName = env.DATABASE_NAME;
const databaseUrl = env.CONNECTION_STRING;


export const orm = await MikroORM.init({
    entities: ['dist/**/*.entity.js'],
    entitiesTs: ['src/**/*.entity.ts'],
    dbName: databaseName,
    type: 'mongo',
    clientUrl: databaseUrl,
    highlighter: new MongoHighlighter(),
    debug: process.env.NODE_ENV !== 'test', // Activa logs solo si no es test
})

export const syncShema =async () => {//no se usa en mango
    const generator = orm.getSchemaGenerator()
     /*
    await generator.dropSchema()
    await generator.createSchema()
    */
    await generator.updateSchema()    
}
