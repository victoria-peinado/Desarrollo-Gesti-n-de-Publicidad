import { Repository } from '../shared/repository.js'
import { AdvertisingSpot } from './advertisingSpot.entity.js'

const advertisingSpots = [
  new AdvertisingSpot (
    'tarde',
    11,
    'a02b91bc-3769-4221-beb1-d7a3aeba7dad'
  ),
]

export class AdvertisingSpotRepository implements Repository<AdvertisingSpot> {
  public findAll(): AdvertisingSpot[] | undefined {
    return advertisingSpots
  }

  public findOne(item: { id: string }): AdvertisingSpot | undefined {
    return advertisingSpots.find((advertisingSpot) => advertisingSpot.id === item.id)
  }

  public add(item: AdvertisingSpot): AdvertisingSpot | undefined {
    advertisingSpots.push(item)
    return item
  }

  public update(item: AdvertisingSpot): AdvertisingSpot | undefined {
    const advertisingSpotIdx = advertisingSpots.findIndex((advertisingSpot) => advertisingSpot.id === item.id)

    if (advertisingSpotIdx !== -1) {
      advertisingSpots[advertisingSpotIdx] = { ...advertisingSpots[advertisingSpotIdx], ...item }
    }
    return advertisingSpots[advertisingSpotIdx]
  }

  public delete(item: { id: string }): AdvertisingSpot | undefined {
    const advertisingSpotIdx = advertisingSpots.findIndex((advertisingSpot) => advertisingSpot.id === item.id)

    if (advertisingSpotIdx !== -1) {
      const deletedadvertisingSpots = advertisingSpots[advertisingSpotIdx]
      advertisingSpots.splice(advertisingSpotIdx, 1)
      return deletedadvertisingSpots
    }
  }
}
