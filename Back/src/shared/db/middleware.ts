
import { Request, Response, NextFunction } from 'express'
import { z, ZodError } from 'zod';
import { ObjectIdSchema, CuitSchema, DniSchema } from './schemas.js';
import { EntityRepository, FilterQuery } from '@mikro-orm/core';


// Zod validation middleware
const validateWithSchema = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse and validate request body
      req.body = schema.parse(req.body);
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

const validateDni = (param: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const dni = req.params[param];
    try {
      DniSchema.parse(dni);
      next();
    } catch (error) {
      return res.status(400).json({ message: 'Formato de DNI inválido' });
    }
  };
};

export function createValueChecker<T extends { id?: any }>(
  repository: EntityRepository<T>,
  fieldName: keyof T
) {
  return async (value: any, currentId?: any): Promise<boolean> => {
    const query: FilterQuery<T> = { [fieldName]: value } as FilterQuery<T>;
    const result = await repository.findOne(query);

    if (result) {
      // Si se proporciona currentId y coincide con el id del resultado, es el mismo registro
      if (currentId && result.id === currentId) {
        return false; // No se considera una duplicación
      }
      return true; // Existe otro registro con el mismo valor
    }

    return false; // No existe ningún registro con el valor proporcionado
  };
}
const validateUniqueField = (repository: any, field: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const value = req.body[field]; // Obtener el valor del campo desde el cuerpo de la solicitud
    const entityId = req.params.id; // Obtener el ID del objeto desde los parámetros de la ruta
    if (!value) {
      return res.status(400).json({ message: `Missing ${field}` });  // Si no hay valor, retornar error
    }



    // Verificar si el valor existe en la base de datos, excluyendo el objeto actual
    const valueExists = await createValueChecker(repository, field)(value, entityId);

    if (valueExists) {
      return res.status(400).json({ message: `${field} already exists` });  // Si existe, retornar error
    }

    next();  // Si no existe, continuar con el siguiente middleware
  };
};

function validateIdExistence<T extends object>(
  repository: EntityRepository<T>,
  field: string
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const id = req.body[field];

    // Si el campo no está en la request, continuar sin validar
    if (id === undefined) {
      return next();
    }

    try {
      const entityExists = await repository.findOne(id);
      if (!entityExists) {
        return res.status(404).json({ message: `The provided ${field} does not exist.` });
      }
      next();
    } catch (error) {
      return res.status(500).json({ message: `Error validating ${field}` });
    }
  };
}

/*

function validateSchemaAtribute(schema: z.ZodSchema, atribute: any) {
  let errorMessages = undefined
  try {
    // Parse and validate request body
    atribute = schema.parse(atribute);
  } catch (error) {
    if (error instanceof ZodError) {
      // Unify the path and message into a single string
      errorMessages = error.errors.map((err) => `${err.path.join(".")}: ${err.message}`);
    }
  }
  return [atribute, errorMessages]
};

*/

export { validateWithSchema, validateObjectId, validateCuit, validateDni, validateUniqueField, validateIdExistence,  };  
