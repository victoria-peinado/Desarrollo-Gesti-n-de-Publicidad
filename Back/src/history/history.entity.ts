import crypto from 'node:crypto';

export class History {
  constructor(
    public startTime: string,
    public precio: number,
    public idBlock: string, // ID del bloque al que pertenece este historial
    public id = crypto.randomUUID()
  ) {}
}