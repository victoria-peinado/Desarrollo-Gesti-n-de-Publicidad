export class billingHolder{
    _id?: number;
    cuit: string;
    businessName: string;
    fiscalCondition: string;
    constructor( cuit: string, businessName: string, fiscalCondition: string) {
        this.cuit = cuit;
        this.businessName = businessName;
        this.fiscalCondition = fiscalCondition;
    }
}