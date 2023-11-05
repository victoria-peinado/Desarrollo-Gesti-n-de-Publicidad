export class Trade {
    _id?: number;
    fantasyName: string;
    address: string;
    billingType: string;
    mail: string;
    usualPaymentForm: string;
    type: string;

    constructor(fantasyName: string, address: string, billingType: string, mail: string, usualPaymentForm: string, type: string, CUIT: string) {
        this.fantasyName = fantasyName;
        this.address = address;
        this.billingType = billingType;
        this.mail = mail;
        this.usualPaymentForm = usualPaymentForm;
        this.type = type;
    }
}