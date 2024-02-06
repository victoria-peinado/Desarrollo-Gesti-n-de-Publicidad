export class Price {
    id?: string;
    value: number;
    regDate: Date;
    block: string;

    constructor(value: number, regDate: Date, block: string) {
        this.value = value;
        this.regDate = regDate;
        this.block = block;
    }
}