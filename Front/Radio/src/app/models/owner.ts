export class Owner {
    _id?: string;
    cuit: string;
    businessName: string;
    fiscalCondition: string;
    shops: string[];

    constructor( cuit: string, businessName: string, fiscalCondition: string, shops: string[]) {
        this.cuit = cuit;
        this.businessName = businessName;
        this.fiscalCondition = fiscalCondition;
        this.shops = shops;
    }
}