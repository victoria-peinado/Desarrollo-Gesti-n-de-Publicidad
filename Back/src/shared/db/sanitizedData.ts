import { ContactInterface } from "../../contact/contact.entity.js";
import { billingType, PaymentMethod, ShopInterface, ShopType } from "../../shop/shop.entity.js";

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

const shop1: ShopInterface = {
    fantasyName: "Transporte DJJB",
    billingType: billingType.FacturaA,
    type: ShopType.Empresa,
    mail: "info@djjb.com",
    usualPaymentForm: PaymentMethod.Efectivo,
    contact: "",
    owner: "",
    address: "12 de abril 596 - Arroyo Seco"
}

const shop2: ShopInterface = {
    fantasyName: "Informatiks SRL",
    billingType: billingType.FacturaB,
    type: ShopType.PyM,
    mail: "infoksrl@gmail.com",
    usualPaymentForm: PaymentMethod.Transferencia,
    contact: "",
    owner: "",
    address: "San Martin 2425 - Fighiera"
}

