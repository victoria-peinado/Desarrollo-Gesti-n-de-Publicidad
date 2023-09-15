import crypto from 'node:crypto'

export class Contact {
  constructor(
    public name: string,
    public lastName: string,
    public dni: number,
    public contacts: string[],
    public id = crypto.randomUUID()
  ) {}
}
