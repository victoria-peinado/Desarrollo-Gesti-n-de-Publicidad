export class blockPriceHistory {
    id?: string;
    precio: number; //hay que ponerle price en vez de precio
    startTime: string;
    idBlock: string;
    constructor(precio: number, startTime: string, idBlock: string) {
       
        this.precio = precio;
        this.startTime = startTime;
        this.idBlock = idBlock;
    }
}