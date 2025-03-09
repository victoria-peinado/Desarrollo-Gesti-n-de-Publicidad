export class Contract {
    id?: string;
    regDate?: Date;
    dateFrom?: Date;
    dateTo?: Date;
    obs?: string;
    shop?: string;
    orders?: string[];

    constructor(id?: string,dateTo?: Date, obs?: string, regDate?: Date, dateFrom?: Date,  shop?: string, orders?: string[], ) {
        this.regDate = regDate;
        this.dateFrom = dateFrom;
        this.dateTo = dateTo;
        this.obs = obs;
        this.shop = shop;
        this.orders = orders;
        this.id = id;
    }
}