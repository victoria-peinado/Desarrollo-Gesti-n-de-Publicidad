import { AdvertisingSpot } from './advertisingSpot.entity.js';
const advertisingSpots = [
    new AdvertisingSpot('tarde', 11, 'a02b91bc-3769-4221-beb1-d7a3aeba7dad'),
];
export class AdvertisingSpotRepository {
    findAll() {
        return advertisingSpots;
    }
    findOne(item) {
        return advertisingSpots.find((advertisingSpot) => advertisingSpot.id === item.id);
    }
    add(item) {
        advertisingSpots.push(item);
        return item;
    }
    update(item) {
        const advertisingSpotIdx = advertisingSpots.findIndex((advertisingSpot) => advertisingSpot.id === item.id);
        if (advertisingSpotIdx !== -1) {
            advertisingSpots[advertisingSpotIdx] = { ...advertisingSpots[advertisingSpotIdx], ...item };
        }
        return advertisingSpots[advertisingSpotIdx];
    }
    delete(item) {
        const advertisingSpotIdx = advertisingSpots.findIndex((advertisingSpot) => advertisingSpot.id === item.id);
        if (advertisingSpotIdx !== -1) {
            const deletedadvertisingSpots = advertisingSpots[advertisingSpotIdx];
            advertisingSpots.splice(advertisingSpotIdx, 1);
            return deletedadvertisingSpots;
        }
    }
}
//# sourceMappingURL=advertisingSpot.repository.js.map