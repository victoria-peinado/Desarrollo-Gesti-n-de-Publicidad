import crypto from 'node:crypto';
export class AdvertisingSpot {
    constructor(name, duration, id = crypto.randomUUID()) {
        this.name = name;
        this.duration = duration;
        this.id = id;
    }
}
//# sourceMappingURL=advertisingSpot.entity.js.map