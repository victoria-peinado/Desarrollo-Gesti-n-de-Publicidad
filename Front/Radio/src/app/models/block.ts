export class Block {
    id?: string;
    number: string;
    startTime: string;
    constructor( numbre: string, startTime: string) {
        this.number = numbre;
        this.startTime = startTime;
    }
}