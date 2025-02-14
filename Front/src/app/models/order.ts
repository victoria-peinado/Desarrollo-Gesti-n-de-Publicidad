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
    showNmae: string;
    liq: boolean;
    month: string;
    contract: string;
    spot: string;

    constructor(numOrder: string, regDate: Date, totalAds: number, daysAmount: number, nameStrategy: string, totalCost: number, dailyCost: number, obs: string, showNmae: string, liq: boolean, month: string, contract: string, spot: string) {
        this.numOrder = numOrder;
        this.regDate = regDate;
        this.totalAds = totalAds;
        this.daysAmount = daysAmount;
        this.nameStrategy = nameStrategy;
        this.totalCost = totalCost;
        this.dailyCost = dailyCost;
        this.obs = obs;
        this.showNmae = showNmae;
        this.liq = liq;
        this.month = month;
        this.contract = contract;
        this.spot = spot;
    }
}