import { NextFunction, Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Contract } from "./contract.entity.js";
import { EntityRepository } from "@mikro-orm/core";
import { Shop } from "../shop/shop.entity.js";
import { validateUniqueFields, validateIdsExistence } from "../shared/db/validations.js";
import { addDays, compareAsc, format, subDays, subMonths } from "date-fns";
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
      console.log('Entre a la funcion -- CONTRATO: ', contractToUpdate)
      console.log('El contrato tiene date to: ', contractToUpdate.dateTo)
      if (contractToUpdate.dateTo !== undefined) {
        console.log('El contrato ya tenia dateTo.')
        const today = new Date()
        if (compareAsc(contractToUpdate.dateTo, today) <= 0) {
          //si el contrato ya termino
          return res.status(500).json({ message: 'Is not possible edit finished contracts.' })
        }
      }

      //EDITAR FECHA DESDE
      //la fecha desde tiene que ser mayor a mañana (sin incluir). Esta actualizando, quiere decir que ya existe fecha desde. 
      //Verificar si la nueva fecha es anterior o posterior. 
      //Si existen ordenes con fecha de inicio igual a la fecha desde actual. CONTRATACION ARRANCA A EMITIR CUANDO EXISTE.
      //debo crear una nueva orden (si es que hay una regular con la misma fecha desde de la contratacion) y ponerle fecha hasta como la antigua fechaDesdeContratacion.
      //Si la fecha desde se posterga, y existen ordenes  con dateFrom anterior a esta, se borraran todas las asociaciones, actualizando de forma manual la orden y se recalcularan los atributos.  

      if (req.body.sanitizeInput.dateFrom !== undefined) {
        const newDateFrom = req.body.sanitizeInput.dateFrom
        const mañana = addDays(new Date(), 1)
        console.log('Viene a editarse un dateFrom')
        if (compareAsc(newDateFrom, mañana) > 0) {
          //es valida. La comparo con la fecha actual. 
          if (compareAsc(newDateFrom, contractToUpdate.dateFrom) >= 0) {
            //la nueva fecha es posterior a la actual. Verificar que no haya ordenes y borrar. Verificar que no haya ordenes con deteFrom anterior.
            //VERIFICAMOS QUE HAYA ORDENES EN EL MES DE LA FECHA 
            const ordersToUpdate = await em.find(Order, { contract: contractToUpdate.id, regular: true, dateFrom: { $lt: newDateFrom } })
            console.log('newDateFrom es posterior a la oldDateFrom del contrato.')
            if (ordersToUpdate.length > 0) {
              //tengo ordenes para actualizar. Regulares, que arrancan antes de lo correspondiente. 
              console.log('Hay ordenes regulares que arrancan antes de lo que corresponde.')
              for (const actualOrder of ordersToUpdate) {
                // puedo cancelarla y crear una nueva con los nuevos atributos.
                const dateToOrder = actualOrder.dateTo
                //asigno la anterior como cancelada. 
                await actualizarPostCancelacion(actualOrder, actualOrder.dateFrom, [], 'CONTRATACION MODIFICADA. INICIA MAS TARDE') //cancelo la orden. Asigno fecha de cancelacion igual a fecha de inicio.

                //creo una nueva orden con la actual: 
                await crearOrdenRegularRenovada(actualOrder, newDateFrom, [], dateToOrder)
                console.log('Borramos una orden y creamos una nueva')

              }
            }

          } else {
            //es anterior. Si existe una orden con esa fecha hay que actualizarlas
            console.log('La orden arranca despues de lo correcto. Creamos una nueva orden para la diferencia. ')
            const ordersToUpdate = await em.find(Order, { contract: contractToUpdate.id, regular: true, dateFrom: contractToUpdate.dateFrom })
            if (ordersToUpdate.length > 0) {
              //tengo ordenes para actualizar. Regulares. Puedo crear una por la diferencia de dias.
              for (const actualOrder of ordersToUpdate) {
                const newOrderDateTo = subDays(actualOrder.dateFrom, 1)
                await crearOrdenRegularRenovada(actualOrder, newDateFrom, [], newOrderDateTo)
              }
            } //else {
            //no tengo ordenes para actualizar. Puedo ignorarlo}
          }
        }
      }


      if (req.body.sanitizeInput.observations !== undefined) {
        contractToUpdate.observations += '  --------- ' + req.body.sanitizeInput.observations
      }
      if (req.body.sanitizeInput.dateTo !== undefined) {
        console.log('Tengo fecha de cancelacion.')
        //tengo una fecha de cancelacion.
        //si el contrato ya tenia fecha de cancelación debo extender las ordenes de forma manual, si la fecha de cancelacion es este mes. Si es en un futuro se hará sola y no habra cambios. 
        //si no tenia debo eliminar las ordenes hasta ese dia, si es que las hay. Tambien eliminar todas las futuras. 
        const dateTo = new Date(req.body.sanitizeInput.dateTo)
        //verifico que no sea anterior a hoy.
        if (compareAsc(dateTo, new Date()) <= 0) {
          //la fecha hasta es menor a hoy o igual.
          return res.status(500).json({ message: 'No se puede actualizar un contrato con fecha anterior o igual a hoy.' });
        }

        //si no tengo ordenes con ese mes, y es futura, quiere decir que las ordenes no se renovaron - puedo ignorarlo.
        const monthTo = format(dateTo, 'MM-yyyy')

        //borro todas las ordenes futuras.
        const ordenesFuturas = await em.find(Order, { contract: contractToUpdate.id, dateFrom: { $gte: dateTo } })
        em.remove(ordenesFuturas)
        em.persist(contractToUpdate)
        console.log('Acabo de eliminar las ordenes futuras a la nueva fecha de cancelacion.')

        const ordersToCheck = await em.find(Order, { contract: contractToUpdate.id, month: monthTo })
        if (ordersToCheck.length !== 0) {
          console.log('Tengo ordenes en el mismo mes que el de cancelacion')
          //tengo ordenes en el mismo mes. 
          for (const order of ordersToCheck) {
            const orderDateTo = new Date(order.dateTo)
            if (compareAsc(dateTo, orderDateTo) < 1) {
              //el contrato termina antes o el mismo dia que la orden.
              await actualizarPostCancelacion(order, dateTo, [], 'CONTRATACION CANCELADA.')
              //verificar si hay ordenes futuras y borrarlas... puedo borrar aquellas con dateFrom >= cancelDateContract

              em.persist(order)
              console.log('Cancelo las ordenes del mismo mes que terminan despues de newDateTo')

            } else {
              //si el contrato termina despues que la orden pero en el mismo mes...
              //puede ser cuando estiran la fecha de cancelación.
              //si la orden es regular -> generar una con los dias faltantes
              // notRegularOrder -> ignorar. 
              if (order.regular) {
                //const beforeMonth = mesAnterior(dateTo)
                //const ordenAnterior = await em.findOneOrFail(Order, { contract: contractToUpdate.id, month: beforeMonth, regular: true })
                console.log('Vamos a crear una nueva orden a partir del dia de la orden anterior.')
                //la fecha de inicio es al dia siguiente que el que termino la orden del mes de cancelacion.
                const newDateFrom = addDays(order.dateTo, 1)
                //crear una nueva orden a base de la anterior. Ya la guarda en la bbdd.
                //creo que puedo mandarle directamente la order
                await crearOrdenRegularRenovada(order, newDateFrom, [], dateTo)
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