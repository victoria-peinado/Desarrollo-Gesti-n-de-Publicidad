//Funciones de ejecución automatica.
//Docs: https://www.npmjs.com/package/node-cron


import cron from 'node-cron';
import { renovateRegularOrders } from '../order/order.controler.js';
import { format } from 'date-fns';
import { getNextMonthString } from './datesUtilities.js';
import { orm } from './db/orm.js';
import { RequestContext } from '@mikro-orm/core';

/*
 # ┌────────────── second (optional)
 # │ ┌──────────── minute
 # │ │ ┌────────── hour
 # │ │ │ ┌──────── day of month
 # │ │ │ │ ┌────── month
 # │ │ │ │ │ ┌──── day of week
 # │ │ │ │ │ │
 # │ │ │ │ │ │
 # * * * * * *
*/

//El evento se ejecuta todos los dias a las 23 hs. Verifica si es el ultimo del mes. 
//Si es el ultimo, renueva todas las ordenes regulares del mes anterior. 

const scheduleDay = '0 23 * * *'
const testDay = nextTestTwoMin()

export async function scheduleEvents() {
    console.log('Evento de renovación programado.')
    //Programamos el evento antes de crear el servidor.
    //Para probar poner testDay en el lugar de scheduleDay
    cron.schedule(scheduleDay, async () => {

        if (isLastMonthDay()) {
            //console.log('Pase el if del ultimo dia ')
            const em = orm.em.fork();  //  Crea un nuevo contexto del ORM 
            await RequestContext.createAsync(em, async () => { //crea manualmente el contexto que crea Express con las peticiones HTTP
                try {
                    const actualMonth = format(new Date(), 'MM-yyyy')
                    const ordersCreated = await renovateRegularOrders(actualMonth)
                    if (ordersCreated[0] === false) {
                        throw new Error('No se ha creado ninguna orden.' + ordersCreated[1])
                    } else {
                        console.log('Las ordenes se han creado con exito.')
                        for (const ord of ordersCreated[1]) {
                            console.log(ord.id)
                        }
                        //console.log('Todas las ordenes: ', ordersCreated[1])
                    }
                } catch (error) {
                    console.error('Error en la tarea programada:', error);
                }
            });
        }
    });
}



function isLastMonthDay(): boolean {
    const hoy = new Date();
    const manana = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1);
    return manana.getDate() === 1;
}

function nextTestTwoMin() {
    const hoy = new Date();
    const prox = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), hoy.getHours(), hoy.getMinutes() + 2);
    const str = prox.getMinutes() + ' ' + hoy.getHours() + ' ' + hoy.getDate() + ' ' + (hoy.getMonth() + 1) + ' ' + '*'
    return str
}

