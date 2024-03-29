import { MikroORM } from "@mikro-orm/core";
import { MongoHighlighter } from "@mikro-orm/mongo-highlighter";

export const orm = await MikroORM.init({
    entities: ['dist/*/*.entity.js'],
    entitiesTs: ['src/*/*.entity.ts'],
    dbName: 'Publicidades',
    type: 'mongo',
    clientUrl: 'mongodb+srv://lautarobrancatti:dwsbrancatti@cluster0.lcibypz.mongodb.net/',
    highlighter: new MongoHighlighter(),
    debug: true,
})

export const syncShema =async () => {
    const generator = orm.getSchemaGenerator()
     /*
    await generator.dropSchema()
    await generator.createSchema()
    */
    await generator.updateSchema()    
}