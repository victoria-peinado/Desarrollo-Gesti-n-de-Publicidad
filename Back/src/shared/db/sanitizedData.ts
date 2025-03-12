import { Request, Response } from "express";;
import { Contact, ContactInterface } from "../../contact/contact.entity.js";
import { Contract, ContractInterface } from "../../contract/contract.entity.js";
import { DayOrderBlock } from "../../day_order_block/day_order_block.entity.js";
import { BlocksRegularType, Order, OrderInterface } from "../../order/order.entity.js";
import { FiscalCondition, Owner, OwnerInterface } from "../../owner/owner.entity.js";
import { billingType, PaymentMethod, Shop, ShopInterface, ShopType } from "../../shop/shop.entity.js";
import { orm } from "./orm.js";
import { asingAtributes, crearOrdenRegularRenovada } from "../../order/order.controler.js";
import { any } from "zod";


const em = orm.em

export async function sanitizadorBBDD(req: Request, res: Response) {
    try {
        const result = await createInfoSanitized()
        res.status(200).json({ message: 'todo salio bien', data: result })
    }
    catch (error: any) {
        res.status(500).json({ message: error })
    }
}

export async function createInfoSanitized() {
    //podriamos borrar todo lo existente en la base de datos. 

    try {
    //     const shops = await em.find(Shop, {})
    //     const ownersToDelete = await em.find(Owner, {})
    //     const contactsToDelte = await em.find(Contact, {})
    //     const contractsToDelete = await em.find(Contract, {})
    //     const ordersToDelete = await em.find(Order, {})
    //     const dosbToDelete = await em.find(DayOrderBlock, {})
    //     em.remove(dosbToDelete)
    //     em.remove(ordersToDelete)
    //     em.remove(contractsToDelete)
    //     em.remove(shops)
    //     em.remove(ownersToDelete)
    //     em.remove(contactsToDelte)
    //     await em.flush()
     }
    catch (error: any) {
    //     return { message: 'Ha sucedido un error', error: error }

    }

    try {

        const contact_shop1: ContactInterface = {
            name: "Juan",
            lastname: "Perez",
            dni: "22458936",
            contacts: ['341-3120045', 'jperez@gmail.com']
        }

        const contact_shop2: ContactInterface = {
            name: "Mauro",
            lastname: "Sanchez",
            dni: "44856325",
            contacts: ['341-8773291', 'infoksrl@gmail.com']
        }


        const owner_shop1: OwnerInterface = {
            cuit: "30500010912",
            businessName: "Perez Juan",
            fiscalCondition: FiscalCondition.RESPONSABLE_INSCRIPTO
        }

        const owner_shop2: OwnerInterface = {
            cuit: "30999032083",
            businessName: "Informatiks SRL",
            fiscalCondition: FiscalCondition.RESPONSABLE_INSCRIPTO
        }


        //GUARDAR EN LA BASE DE DATOS PARA OBTENER LOS ID.
        const contactShop1 = em.create(Contact, contact_shop1)
        const contactShop2 = em.create(Contact, contact_shop2)
        const ownerShop1 = em.create(Owner, owner_shop1)
        const ownerShop2 = em.create(Owner, owner_shop2)
        await em.flush()
        if (!contactShop1 || !contactShop2 || !ownerShop1 || !ownerShop2) {
            return 'Ocurrio un error al crear el Contacto o el Owner'
        }





        const shop1: ShopInterface = {
            fantasyName: "Transporte DJJB",
            billingType: billingType.FacturaA,
            type: ShopType.Empresa,
            mail: "info@djjb.com",
            usualPaymentForm: PaymentMethod.Efectivo,
            contact: contactShop1._id!.toString(), // id: contact_shop1
            owner: ownerShop1._id!.toString(), // id: owner_shop1
            address: "12 de abril 596 - Arroyo Seco"
        }

        const shop2: ShopInterface = {
            fantasyName: "Informatiks SRL",
            billingType: billingType.FacturaB,
            type: ShopType.PyM,
            mail: "infoksrl@gmail.com",
            usualPaymentForm: PaymentMethod.Transferencia,
            contact: contactShop2._id!.toString(), // id: contact_shop2
            owner: ownerShop2._id!.toString(), // id: owner_shop2
            address: "San Martin 2425 - Fighiera"
        }


        //GUARDAR EN LA BASE DE DATOS PARA OBTENER LOS ID.
        const shopSave1 = em.create(Shop, shop1)
        const shopSave2 = em.create(Shop, shop2)
        em.flush()
        if (!shopSave1 || !shopSave2) {
            return 'Ocurrio un error inesperado al crear los Shops.'
        }



        const contract1: ContractInterface = {
            dateFrom: new Date(), //yyyy-MM-dd
            observations: "Quiere que se realicen publicidades en Facebook.",
            shop: shopSave1._id!.toString() //id: shop1
        }


        const contract2: ContractInterface = {
            dateFrom: new Date("2025-4-1"), //yyyy-MM-dd
            dateTo: new Date("2025-8-31"), //yyyy-MM-dd
            observations: "Prefiere estar en el final de la tanda.",
            shop: shopSave2._id!.toString()//id: shop2
        }


        //GUARDAR PARA OBTENER LOS ID

        const contractSave1 = em.create(Contract, contract1)
        const contractSave2 = em.create(Contract, contract2)
        em.flush
        if (!contractSave1 || !contractSave2) {
            return 'Ocurrio un error inesperado al crear los contratos.'
        }


        const regularStructure1: BlocksRegularType = {
            monday: ['1', '2', '3', '4'],
            tuesday: ['1', '2', '3', '4'],
            wednesday: ['1', '2', '3', '4'],
            thursday: ['1', '2', '3', '4'],
            friday: ['1', '2', '3', '4'],
            saturday: ['5', '6', '7', '8', '9'],
            sunday: ['5', '6', '7', '8', '9']
        }

        const notRegularStructure1: [string, string[]][] = [["2025-4-25", ["1", "2", "3", "4"]], ["2025-4-26", ["5", "6", "7", "8"]], ["2025-4-27", ["9", "10", "11", "12"]], ["2025-4-28", ["9", "10", "11", "12"]], ["2025-4-24", ["20", "19", "16", "12"]]]// [ date, [numBlocks..] ]


        const regularStructure2: BlocksRegularType = {
            monday: ['10', '12', '13', '14'],
            tuesday: ['10', '12', '13', '14'],
            wednesday: ['10', '12', '13', '14'],
            thursday: ['10', '12', '13', '14'],
            friday: ['10', '12', '13', '14'],
            saturday: ['15', '16', '17', '18', '19'],
            sunday: ['15', '16', '17', '18', '19']
        }


        /* SPOT
            id: "67c5270f29de2f00c7260987",
            long: 8798404,
            regDate: "2025-03-03T03:50:39.746Z",
            name: "Universo_Paralelo_-_La_K'onga-1740973839666.mp3",
            path: "C:\\Users\\lauta\\Documents\\UNIVERSIDAD\\MATERIAS 2023\\Desarrollo de Software\\Practica Clases\\Api-Publicidades-Git-Victoria\\Desarrollo-Gesti-n-de-Publicidad\\Back\\audios\\Universo_Paralelo_-_La_K'onga-1740973839666.mp3"
        */



        const order_regular_shop1: OrderInterface = {
            nameStrategy: "Servicios de Transporte",
            obs: " Texto: Ofrecemos servicios logistico para cargas de alto volumen. Encontranos en ... .",
            showName: "Siempre al dia",
            month: "04-2025",
            regular: true,
            regStructure: regularStructure1,
            contract: contractSave1._id!.toString(),
            spot: "67c5270f29de2f00c7260987",
            dateFrom: new Date(),
            dateTo: new Date(),
            regDate: new Date(),
            liq: false,
        }


        const order_notRegular_shop1: OrderInterface = {
            nameStrategy: "PNT Ofertas del Mes",
            obs: "PNT: Envios a todo el pais por 9000$ oferta especial de este mes",
            showName: "Tarde musical",
            month: "04-2025",
            regular: false,
            contract: contractSave1._id!.toString(),
            spot: "67c5270f29de2f00c7260987",
            dateFrom: new Date(),
            dateTo: new Date(),
            regDate: new Date(),
            liq: false
        }


        const order_regular_shop2: OrderInterface = {
            nameStrategy: "Ampliando servicio Conectados",
            obs: "Servicios Informatico - Cortina musical tecno",
            showName: "Romanticos",
            month: "04-2025",
            regular: true,
            regStructure: regularStructure2,
            contract: contractSave2._id!.toString(),
            spot: "67c5270f29de2f00c7260987",
            dateFrom: new Date('2025-4-1'),
            dateTo: new Date('2025-4-30'),
            regDate: new Date(),
            liq: false
            //cargar spot a mano
        }


        //GUARDAR EN LA BBDD
        const order_regular_s1 = em.create(Order, order_regular_shop1)
        const order_notRegular_s1 = em.create(Order, order_notRegular_shop1)
        const order_regular_s2 = em.create(Order, order_regular_shop2)
        await em.flush()

        let lau: any

        await asingAtributes(order_regular_s1, contractSave1.dateFrom, true, regularStructure1, undefined, undefined)
        await em.flush()

        await asingAtributes(order_regular_s2, new Date('2025-4-1'), true, regularStructure2, undefined, undefined)
        await em.flush()

        const orderNR = await asingAtributes(order_notRegular_s1, contractSave1.dateFrom, order_notRegular_s1.regular, lau, notRegularStructure1, undefined)
        em.persist(orderNR)
        await em.flush()

        if (!order_regular_s1 || !order_regular_s2 || !order_notRegular_s1) {
            return 'Ocurrio un error al crear las ordenes. '
        }

        //los bloques se encuentran cargados. 


        //Metodos de prueba:
        // - Renovar automaticamente las ordenes con el mes 05-2025
        // - Registrar como paga una orden
        // - Cancelar contratacion en curso
        // - Cancelar una orden
        // - Crear nueva orden para esa contratacion





        return {
            message: 'Creado correctamente', contactShop1, contactShop2, ownerShop1, ownerShop2, shopSave1, shopSave2,
            contractSave1, contractSave2, order_regular_s1, order_regular_s2, order_notRegular_s1
        }

    }

    catch (error: any) {
        return { message: 'Ha sucedido un error', error: error }
    }
}
