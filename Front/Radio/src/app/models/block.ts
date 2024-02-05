export class Block {
    id?: string;
    numBlock: string;
    startTime: string;
    prices: string[];
    
    constructor(numBlock: string, startTime: string, prices: string[]) {
        this.numBlock = numBlock;
        this.startTime = startTime;
        this.prices = prices;
    }
}