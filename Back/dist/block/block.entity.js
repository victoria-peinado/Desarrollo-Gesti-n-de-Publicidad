import crypto from 'node:crypto';
export class Block {
    constructor(startTime, number, id = crypto.randomUUID()) {
        this.startTime = startTime;
        this.number = number;
        this.id = id;
    }
}
//# sourceMappingURL=block.entity.js.map