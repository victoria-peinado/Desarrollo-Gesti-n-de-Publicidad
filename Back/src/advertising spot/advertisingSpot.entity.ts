import crypto from 'node:crypto'

export class AdvertisingSpot {
  constructor(
    public name: string,
    public duration: number,
    public id = crypto.randomUUID()
  ) {}
}
