
import { Request, Response, NextFunction } from 'express'
import { z, ZodError } from 'zod';
import { ObjectIdSchema ,CuitSchema} from './schemas.js';



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


const validateCuit = (param: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const cuit = req.params[param];
    try {
      CuitSchema.parse(cuit);
      next();
    } catch (error) {
      return res.status(400).json({ message: 'Formato de CUIT inválido' });
    }
  };
};

export { validateWithSchema, validateObjectId,  validateCuit };  
