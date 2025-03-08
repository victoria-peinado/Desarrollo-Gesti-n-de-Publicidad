import { NextFunction, Request, Response } from "express";;
import { orm } from "../shared/db/orm.js";
import { Price } from "./price.entity.js";
import { Block } from "../block/block.entity.js";
import { EntityRepository } from "@mikro-orm/core";
import { validateIdsExistence } from "../shared/db/validations.js";

const em = orm.em
em.getRepository(Price)
em.getRepository(Block)

function sanitizePriceInput(req: Request, res: Response, next: NextFunction) {
  
    req.body.sanitizeInput = {
        value: req.body.value,
        block: req.body.block,
        regDate: req.body.regDate,
        id: req.params.id
    }
    Object.keys(req.body.sanitizeInput).forEach( (key)=>{ //devuelve un arreglo con las keys y para cada uno chequeamos not null
        if (req.body.sanitizeInput[key] === undefined) {
            delete req.body.sanitizeInput[key]
        }
    })

    next()
}
async function lastPrice(req: Request, res: Response, next: NextFunction) {
  const idBlock = req.params.id;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1); // Establece la fecha para mañana
  tomorrow.setHours(0, 0, 0, 0); // Establece la hora al inicio del día
  tomorrow.setMilliseconds(-1); // Ajusta la fecha para que sea un milisegundo antes del inicio del día de mañana

  try {
    // Realizar la consulta
    const price = await em.findOne(Price, {
      block: idBlock,
      regDate: { $lte: tomorrow } // Filtra fechas menores a mañana
    }, {
      populate: ['block'],
      orderBy: { regDate: 'desc' },
    });

    res.status(200).json({
      message: 'Last history founded successfully',
      data: price
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
        


async function validateIdsAndUniques<T extends object>(
    sanitizeInput: Partial<T>
): Promise<{ valid: boolean; messages: string[] }> {
    // Usar el EntityManager definido anteriormente

    const repositoryMap = {
        nroBlock: em.getRepository(Block) as unknown as EntityRepository<T>,
    };

    
     const idValidation = await validateIdsExistence(repositoryMap as Record<keyof T, EntityRepository<T>>, sanitizeInput);

    const allErrors = [ ...idValidation.messages];

    return {
        valid: allErrors.length === 0,
        messages: allErrors
    };
}
async function validateRequestInput(res: Response, sanitizeInput: any): Promise<boolean> {
    try {
        const validation = await validateIdsAndUniques(sanitizeInput);
        if (!validation.valid) {
            res.status(400).json({ messages: validation.messages });
            return false;
        }
        return true;
    } catch (validationError: any) {
        res.status(500).json({ message: 'Validation failed', error: validationError.message });
        return false;
    }
}

async function findAll(req: Request, res: Response) {
      try {
        const prices = await em.find(Price, {}, {populate:['block']})
        res.status(200).json({message: 'Find all Price', data: prices})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}

async function findOne(req: Request, res: Response) {
   try {
    const id = req.params.id
    const prices = await em.findOneOrFail(Price, { id }, {populate:['block']})
    res.status(200).json({message: 'Price founded sucsesfully', data:prices })
   } catch (error: any) {
     res.status(500).json({message: error.message})
   }
}
async function add(req: Request, res: Response) {
  try {
    const sanitizeInput = req.body.sanitizeInput;
    sanitizeInput.regDate = new Date(sanitizeInput.regDate);

    if (!(await validateRequestInput(res, sanitizeInput))) {
      return;
    }

    try {
      const price = em.create(Price, sanitizeInput);
      await em.flush();
      res.status(201).json({ message: 'Price created successfully', data: price });
    } catch (creationError: any) {
      res.status(500).json({ message: 'Price creation failed', error: creationError.message });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Unexpected error', error: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const sanitizeInput = req.body.sanitizeInput;

    if (!(await validateRequestInput(res, sanitizeInput))) {
      return;
    }

    try {
      const price = em.getReference(Price, id);
      em.assign(price, sanitizeInput);
      await em.flush();
      res.status(200).json({ message: 'Price modified successfully', data: price });
    } catch (updateError: any) {
      res.status(500).json({ message: 'Price update failed', error: updateError.message });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Unexpected error', error: error.message });
  }
}


async function remove(req: Request, res: Response) {
    try {
        return res.status(403).json({ message: 'This operation is not allowed' });

        // const id = req.params.id;
        // const price = em.getReference(Price, id);
        // await em.removeAndFlush(price);

        // res.status(200).json({ message: 'Price deleted successfully', data: price });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function addAllPrices (req: Request, res: Response){
    try {
        const blocks = await em.find(Block, {})
        let prices: Price[] = []
        blocks.forEach((blocks) => {
            req.body.sanitizeInput.block = blocks.id
            const price = em.create(Price, req.body.sanitizeInput)  
            prices.push(price)
        }) 
        em.flush()
    res.status(200).json({message: 'All blocks whit a new price assigned', data: prices})

    } catch (error: any) {
    res.status(500).json({message: error.message})
   }

}


export {sanitizePriceInput, findAll, findOne, add, update, remove, addAllPrices, lastPrice}