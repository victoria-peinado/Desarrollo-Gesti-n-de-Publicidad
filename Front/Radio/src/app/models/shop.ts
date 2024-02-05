export class Shop {
    _id?: string;
    regDate: Date;
    fantasyName: string;
    address: string;
    billingType: string;
    mail: string;
    usualPaymentForm: string;
    type: string;
    owner: string;
    contact: string;
    contracts: string[];

    constructor(regDate: Date, fantasyName: string, address: string, billingType: string, mail: string, usualPaymentForm: string, type: string, owner: string, contact: string, contracts: string[]) {
        this.regDate = regDate;
        this.fantasyName = fantasyName;
        this.address = address;
        this.billingType = billingType;
        this.mail = mail;
        this.usualPaymentForm = usualPaymentForm;
        this.type = type;
        this.owner = owner;
        this.contact = contact;
        this.contracts = contracts;
    }
}