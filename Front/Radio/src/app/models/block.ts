export class Block {
    id?: string;
    numbre: string;
    startTime: string;
    constructor( numbre: string, startTime: string) {
        this.numbre = numbre;
        this.startTime = startTime;
    }
}