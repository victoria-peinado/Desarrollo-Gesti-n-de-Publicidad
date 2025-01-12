//app.ts

// por que no uso cors (¿nuestra app es libre?) --CODELIC TV: usa el mismo esquema de carpetas
//Nuestra app solo devuelve json, ¿no?
//CORES MIDULAWEN... VIDEOS


import 'reflect-metadata'
import express from "express";
import { contactRouter } from "./contact/contact.routes.js";
import { contractRouter } from './contract/contract.routes.js';
import { shopRouter } from './shop/shop.routes.js';
import { orm } from './shared/db/orm.js';
import {RequestContext} from '@mikro-orm/core';
import cors from 'cors';
import { ownerRouter } from './owner/owner.routes.js';
import { blockRouter } from './block/block.routes.js';
import { priceRouter } from './price/price.routes.js';
import { spotRouter } from './spot/spot.routes.js';
import { orderRouter } from './order/order.routes.js';

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());//middleware para parsear el body a json

app.use(cors({ origin: 'http://localhost:4200' }));

//luego de los middlewares base
app.use((req, res, next) => {
  RequestContext.create(orm.em, next)
})

//antes de la tura y los middlewares de negocio


app.use("/api/contact", contactRouter)
app.use("/api/contract", contractRouter)
app.use("/api/shop", shopRouter)
app.use("/api/owner", ownerRouter)
app.use("/api/block", blockRouter)
app.use("/api/price", priceRouter)
app.use("/api/spot", spotRouter)
app.use("/api/order", orderRouter)

//RUTA POR DEFECTO CUANDO ESTA MAL LA URL INGRESADA

app.use((_, res) => {
  res.status(404).json({ messege: "Resourse not found" })
})

// LISTEN SERVIDOR

app.listen(PORT, () => {
  console.log("Server running in http:\\localhost:" + PORT)
})

