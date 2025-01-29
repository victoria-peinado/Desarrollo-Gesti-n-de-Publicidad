
import { z } from 'zod';
// ObjectId Validation for MongoDB IDs
const ObjectIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid MongoDB ObjectId");

const validCuit = (cuit: string): boolean => {
  if (cuit.length !== 11) return false;

  const base = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  const total = cuit
    .split('')
    .slice(0, 10)
    .reduce((acc, digit, index) => acc + Number(digit) * base[index], 0);

  const mod11 = 11 - (total % 11);
  return mod11 === 11 ? cuit[10] === '0' : mod11 === 10 ? false : cuit[10] === mod11.toString();

};
const CuitSchema = z
  .string()
  .length(11, 'El CUIT debe tener exactamente 11 dígitos')
  .refine((cuit) => {
    const base = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    const total = cuit
      .split('')
      .slice(0, 10)
      .reduce((acc, digit, index) => acc + Number(digit) * base[index], 0);
    const mod11 = 11 - (total % 11);
    return mod11 === 11 ? cuit[10] === '0' : mod11 === 10 ? false : cuit[10] === mod11.toString();
  }, 'CUIT inválido');

export { ObjectIdSchema,  CuitSchema };