export class Contract {
    id?: string;
    regDate?: Date;
    dateFrom?: string | undefined;
    dateTo?: string | undefined;
    observations?: string;
    shop?: string;
    orders?: string[];
    //     dateFrom: string | undefined;
    // dateTo?: string | undefined;
    // observations: string;
    // shop: string;
    // orders?: string[];

    // constructor(regDate: Date, dateFrom: string, dateTo: string, obs: string, shop: string, orders: string[]) {

    constructor(id?: string,dateTo?: string, obs?: string, regDate?: Date, dateFrom?: string,  shop?: string, orders?: string[], ) {
        this.regDate = regDate;
        this.dateFrom = dateFrom;
        this.dateTo = dateTo;
        this.observations = obs;
        this.shop = shop;
        this.orders = orders;
        this.id = id;
    }
}