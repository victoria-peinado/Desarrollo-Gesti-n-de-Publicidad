//Funciones de ejecución automatica. 
import cron from 'node-cron';
import { renovateRegularOrders } from '../order/order.controler.js';
import { format } from 'date-fns';
import { Order } from '../order/order.entity.js';


cron.schedule('0 0 * * *', async () => {
    try {
        if (isLastMonthDay()) {
            const nextMonthString = getNextMonthString()
            const ordersCreated = await renovateRegularOrders(nextMonthString)
            if (ordersCreated === undefined){
                throw new Error('No se ha creado ninguna orden.')
            }

        }
    } catch (error) {
        console.error('Error durante la ejecución de la tarea:', error);

    }
});

function isLastMonthDay(): boolean {
    const hoy = new Date();
    const manana = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1);
    return manana.getDate() === 1;
}

function getNextMonthString(): string {
    const hoy = new Date()
    const manana = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1);
    return format(manana, 'MM-yyyy')
}