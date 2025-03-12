export class Order {
    id?: string;
    numOrder: string;
    regDate: Date;
    totalAds: number;
    daysAmount: number;
    nameStrategy: string;
    totalCost: number;
    dailyCost: number;
    obs: string;
    showName: string;
    liq: boolean;
    regular: boolean;
    month: string;
    contract: string;
    spot: string;

    constructor(numOrder: string, regDate: Date, totalAds: number, daysAmount: number, nameStrategy: string, totalCost: number, dailyCost: number, obs: string, showName: string, liq: boolean, regular: boolean, month: string, contract: string, spot: string) {
        this.numOrder = numOrder;
        this.regDate = regDate;
        this.totalAds = totalAds;
        this.daysAmount = daysAmount;
        this.nameStrategy = nameStrategy;
        this.totalCost = totalCost;
        this.dailyCost = dailyCost;
        this.obs = obs;
        this.showName = showName;
        this.liq = liq;
        this.regular = regular;
        this.month = month;
        this.contract = contract;
        this.spot = spot;
    }
}