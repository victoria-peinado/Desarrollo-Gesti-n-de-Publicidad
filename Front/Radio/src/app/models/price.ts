import { Block } from './block';
export class Price {

    id?: string;
    value: number;
    regDate: Date;
    block: Block;

    constructor(value: number, regDate: Date, block:  Block) {
        this.value = value;
        this.regDate = regDate;
        this.block = block;
    }
}