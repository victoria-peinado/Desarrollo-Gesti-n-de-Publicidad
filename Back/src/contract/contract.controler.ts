import { NextFunction, Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Contract } from "./contract.entity.js";
import { EntityRepository } from "@mikro-orm/core";
import { Shop } from "../shop/shop.entity.js";
import { validateUniqueFields, validateIdsExistence } from "../shared/db/validations.js";
import { addDays, compareAsc, format, subMonths } from "date-fns";
import { Order } from "../order/order.entity.js";
import { actualizarPostCancelacion, crearOrdenRegularRenovada } from "../order/order.controler.js";

const em = orm.em //entityManager
em.getRepository(Contract)
async function validateIdsAndUniques<T extends object>(
  sanitizeInput: Partial<T>
): Promise<{ valid: boolean; messages: string[] }> {
  // Usar el EntityManager definido anteriormente

  const uniqueFieldsMap = {
    shop: em.getRepository(Shop) as unknown as EntityRepository<T>,
  };


  const idValidation = await validateIdsExistence(uniqueFieldsMap as Record<keyof T, EntityRepository<T>>, sanitizeInput);

  const allErrors = [...idValidation.messages];

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



function sanitizeContractInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizeInput = {
    regDate: req.body.regDate,
    dateFrom: req.body.dateFrom,
    dateTo: req.body.dateTo,
    observations: req.body.observations,
    shop: req.body.shop,
    id: req.params.id
  }

  Object.keys(req.body.sanitizeInput).forEach((key) => { //devuelve un arreglo con las keys y para cada uno chequeamos not null
    if (req.body.sanitizeInput[key] === undefined) {
      delete req.body.sanitizeInput[key]
    }
  })

  next()
}

async function findAll(req: Request, res: Response) {
  try {
    const contracts = await em.find(Contract, {}, { populate: ['shop', 'orders'] })
    res.status(200).json({ message: 'Find all Contracts', data: contracts })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }

}

async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id
    const contract = await em.findOneOrFail(Contract, { id }, { populate: ['shop'] })
    res.status(200).json({ message: 'Contract founded', data: contract })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }

}

async function add(req: Request, res: Response) {
  try {
    const sanitizeInput = req.body.sanitizeInput;

    if (!(await validateRequestInput(res, sanitizeInput))) {
      return;
    }

    try {
      const contract = em.create(Contract, sanitizeInput);
      await em.flush();
      res.status(201).json({ message: 'Contract created successfully', data: contract });
    } catch (creationError: any) {
      res.status(500).json({ message: 'Contract creation failed', error: creationError.message });
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
      const contractToUpdate = await em.findOneOrFail(Contract, { id });
      if (contractToUpdate.dateTo !== undefined) {
        const today = new Date()
        if (compareAsc(contractToUpdate.dateTo, today) <= 0) {
          //si el contrato ya termino
          return res.status(500).json({ message: 'Is not possible edit finished contracts.' })
        }
      }
      if (req.body.sanitizeInput.observations !== undefined) {
        contractToUpdate.observations += '  --------- ' + req.body.sanitizeInput.observations
      }
      if (req.body.sanitizeInput.dateTo !== undefined) {
        //tengo una fecha de cancelacion.
        const dateTo = new Date(req.body.sanitizeInput.dateTo)
        //verifico que no sea anterior a hoy.
        if (compareAsc(dateTo, new Date()) <= 0) {
          //la fecha hasta es menor a hoy o igual.
          return res.status(500).json({ message: 'No se puede actualizar un contrato con fecha anterior o igual a hoy.' });
        }

        //si no tengo ordenes con ese mes, y es futura, quiere decir que las ordenes no se renovaron - puedo ignorarlo.
        const monthTo = format(dateTo, 'MM-yyyy')

        const ordenesFuturas = await em.find(Order, { contract: contractToUpdate.id, dateFrom: { $gte: dateTo } })
        em.remove(ordenesFuturas)
        em.persist(contractToUpdate)

        const ordersToCheck = await em.find(Order, { contract: contractToUpdate.id, month: monthTo })
        if (ordersToCheck.length !== 0) {
          //borro todas las ordenes futuras.

          //tengo ordenes en el mismo mes. 
          for (const order of ordersToCheck) {
            const orderDateTo = new Date(order.dateTo)
            if (compareAsc(dateTo, orderDateTo) < 1) {
              //el contrato termina antes o el mismo dia que la orden.
              await actualizarPostCancelacion(order, dateTo, [], 'CONTRATACION CANCELADA.')
              //verificar si hay ordenes futuras y borrarlas... puedo borrar aquellas con dateFrom >= cancelDateContract

              em.persist(order)

            } else {
              //si el contrato termina despues que la orden pero en el mismo mes...
              //puede ser cuando estiran la fecha de cancelación.
              //si la orden es regular -> generar una con los dias faltantes
              // notRegularOrder -> ignorar. 
              if (order.regular) {
                const beforeMonth = mesAnterior(dateTo)
                const ordenAnterior = await em.findOneOrFail(Order, { contract: contractToUpdate.id, month: beforeMonth, regular: true })
                console.log('Vamos a crear una nueva orden a partir del dia de la orden anterior.')
                //la fecha de inicio es al dia siguiente que el que termino la orden del mes de cancelacion.
                const newDateFrom = addDays(order.dateTo, 1)
                //crear una nueva orden a base de la anterior. Ya la guarda en la bbdd.
                //creo que puedo mandarle directamente la order
                await crearOrdenRegularRenovada(ordenAnterior, newDateFrom, [], dateTo)
              }

            }

          }

        }



      }
      em.persist(contractToUpdate);
      await em.flush();
      res.status(200).json({ message: 'Contract and Orders updated successfully and ', data: { contractToUpdate } });
    } catch (updateError: any) {
      res.status(500).json({ message: 'Contract update failed', error: updateError.message });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Unexpected error', error: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    return res.status(403).json({ message: 'This operation is not allowed' });

    // const id = req.params.id;
    // const contractToRemove = em.getReference(Contract, id);
    // await em.removeAndFlush(contractToRemove); // Should be sanitized

    // res.status(200).json({ message: 'Contract removed successfully', data: contractToRemove });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function getContractsByShopId(req: Request, res: Response) {
  try {
    const idShop = req.params.idShop
    const contracts = await em.find(Contract, { shop: idShop }, { populate: ['shop'] }) //¿popular con contacto y titular?
    res.status(200).json({ message: 'Contract founded sucesfully', data: contracts })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}


function mesAnterior(date: Date) {
  const fechaAnterior = subMonths(date, 1);
  return format(fechaAnterior, 'MM-yyyy');
}

export { sanitizeContractInput, getContractsByShopId, findAll, findOne, add, update, remove }