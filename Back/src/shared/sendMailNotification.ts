import { Request, Response, NextFunction } from "express";
import { Order } from "../order/order.entity.js";
import { orm } from "./db/orm.js";
import { sendEmail } from "./mailFunctions.js";
import { Shop } from "../shop/shop.entity.js";


const em = orm.em
em.getRepository(Order)

const cabecera = 'Estimado. \n Le informamos que en nuestros sistemas usted, al día de la fecha, registra una deuda. A continuación listaremos las ordenes publicitarias no abonadas asociadas a su empresa. Si considera que existe un error en la información mostrada por favor comuniquese con la empresa. '

const cierre = 'Si usted abonó alguna de las ordenes listadas por favor informenos. Lamentamos las molestias ocacionadas. \n FM Asunción 90.7 \n 34 años en dialogo con la ciudad. \n'

export function sanitizeMailInput(req: Request, res: Response, next: NextFunction) {
    req.body.sanitizeInput = {
        id: req.body.id
    }
    Object.keys(req.body.sanitizeInput).forEach((key) => {
        if (req.body.sanitizeInput[key] === undefined) {
            delete req.body.sanitizeInput[key]
        }
    })

    next()
}


function createTextLine(order: Order) {
    const text = '--> Orden nro: ' + order.id + ' - Importe: ' + order.totalCost + ' - Mes: ' + order.month + ' - Regular: ' + order.regular + '\n'
    return text
}

export async function notifyByMail(req: Request, res: Response) {
    try {
        console.log('Ente a la funcion')
        const infoEnviados = []
        const ids = req.body.sanitizeInput.id

        const orders = await em.find(Order, { id: { $in: ids } }, { populate: ['contract', 'contract.shop', 'contract.shop.owner', 'contract.shop.contact'] });

        const ordersByShopId = new Map<string, Order[]>();

        for (const order of orders) {
            const shopId = order.contract.shop.id;
            if (shopId) {
                if (!ordersByShopId.has(shopId)) {
                    ordersByShopId.set(shopId, []);
                } else { throw new Error('La orden no tiene SHOP') }

                ordersByShopId.get(shopId)?.push(order);

            }
        }


        // Ejemplo de cómo acceder a las órdenes agrupadas por cuit
        for (const [shopId, orders] of ordersByShopId) {
            let shop: Shop = orders[0].contract.shop
            let totalDebt: number = 0
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            let detalle: string = 'Comercio: ' + shop.fantasyName + ' \n Deuda registrada: \n '

            for (const order of orders) {
                totalDebt += (order.totalCost ?? 0)
                detalle += createTextLine(order)
            }

            detalle += '\n Deuda total: $' + totalDebt + ' \n \n '

            const text = cabecera + detalle + cierre

            const emails = shop.contact.contacts.filter(item => emailRegex.test(item)); //si es vacio tiene el del comercio
            emails.push(shop.mail)
            const info = await sendEmail(emails, 'Aviso de Deuda', text)
            infoEnviados.push(info)
        }
        res.status(200).json({ message: 'Emails send succesfully', data: infoEnviados })


    }
     catch (error: any) {
    res.status(500).json({ message: error.message })
}
}
