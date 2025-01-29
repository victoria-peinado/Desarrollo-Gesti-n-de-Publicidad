
import { Request, Response, NextFunction } from 'express'
import { z, ZodError } from 'zod';


// ObjectId Validation for MongoDB IDs
const ObjectIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid MongoDB ObjectId");



// Zod validation middleware
const validateWithSchema = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse and validate request body
      req.body =  schema.parse(req.body);
      next(); // Proceed to the next middleware
    } catch (error) {
      if (error instanceof ZodError) {
        // Unify the path and message into a single string
        const errorMessages = error.errors.map((err) => `${err.path.join(".")}: ${err.message}`);
        return res.status(400).json({ errors: errorMessages });
      }
      next(error); // Pass other errors to the error handler
    }
  };
};


// Middleware to validate MongoDB ObjectId in the request params
const validateObjectId = (param: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const id = req.params[param];
    try {
      ObjectIdSchema.parse(id);
      next();
    } catch (error) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
  };
};

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
const validateCuit = (param: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const cuit = req.params[param];
    if (!validCuit(cuit)) {
      return res.status(400).json({ message: 'Formato de CUIT inválido' });
    }
    next();
  };
};

export { validateWithSchema, validateObjectId, validCuit, validateCuit };  
