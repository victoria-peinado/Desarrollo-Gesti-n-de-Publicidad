import crypto from 'node:crypto';
export class History {
    constructor(startTime, precio, idBlock, // ID del bloque al que pertenece este historial
    id = crypto.randomUUID()) {
        this.startTime = startTime;
        this.precio = precio;
        this.idBlock = idBlock;
        this.id = id;
    }
}
//# sourceMappingURL=history.entity.js.map