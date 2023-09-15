import crypto from 'node:crypto' 

export class Block {
  constructor(
    public startTime: string,
    public number: number,
    public id = crypto.randomUUID()
  ) {}
}
