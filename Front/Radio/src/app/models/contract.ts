export class Contract {
    _id?: string;
    regDate: Date;
    dateFrom: Date;
    dateTo: Date;
    obs: string;
    shop: string;
    orders: string[];

    constructor(regDate: Date, dateFrom: Date, dateTo: Date, obs: string, shop: string, orders: string[]) {
        this.regDate = regDate;
        this.dateFrom = dateFrom;
        this.dateTo = dateTo;
        this.obs = obs;
        this.shop = shop;
        this.orders = orders;
    }
}