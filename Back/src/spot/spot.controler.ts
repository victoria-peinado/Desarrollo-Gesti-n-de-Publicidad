import { NextFunction, Request, Response } from "express";;
import { orm } from "../shared/db/orm.js";
import { Spot } from "./spot.entity.js";
import { Order } from "../order/order.entity.js";

const em = orm.em
em.getRepository(Spot)

function sanitizeSpotInput(req: Request, res: Response, next: NextFunction) {
    req.body.sanitizeInput = {
        long: req.body.long,
        name: req.body.name,
        path: req.body.path,
        order: req.body.order,
        id: req.params.id
    }
    Object.keys(req.body.sanitizeInput).forEach( (key)=>{ 
            if (req.body.sanitizeInput[key] === undefined) {
            delete req.body.sanitizeInput[key]
        }
    })

    next()
}


async function findAll(req: Request, res: Response) {
      try {
        const spots = await em.find(Spot, {})
        res.status(200).json({message: 'Find all Spots', data: spots})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
    }

async function findOne(req: Request, res: Response) {
   try {
    const id = req.params.id
    const spot = await em.findOneOrFail(Spot, { id })
    res.status(200).json({message: 'Spot founded sucsesfully', data: spot})
   } catch (error: any) {
     res.status(500).json({message: error.message})
   }
}


async  function add(req: Request, res: Response) {
    try{
        const spot = em.create(Spot, req.body.sanitizeInput)
        await em.flush()
        res.status(201).json({message: 'Spot created succesfully', data: spot})
    } catch(error: any) {
        res.status(500).json({message: error.message})
    }
}


async function update(req: Request, res: Response)  {
   try {
    const id = req.params.id
    const spot = em.getReference(Spot, id)
    em.assign(spot, req.body.sanitizeInput)
    await em.flush()
    res.status(200).json({message: 'Spot modificated succesfully', data: spot})
   } catch (error: any) {
    res.status(500).json({message: error.message})
   }
}


async function remove(req: Request, res: Response) {
    try {
        const id = req.params.id;

        // Buscar el spot antes de eliminarlo
        const spot = await em.findOne(Spot, { id }, { populate: ['orders'] });

        if (!spot) {
            return res.status(404).json({ message: 'Spot not found' });
        }

        // Eliminar la referencia en los pedidos relacionados
       await em.nativeUpdate(Order, { spot: spot }, { spot: undefined });

        // Ahora eliminar el spot
        await em.removeAndFlush(spot);

        res.status(200).json({ message: 'Spot deleted successfully', data: spot });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function upload(req: Request, res: Response){
    console.log('ingrese a la funcion upload.')
    try {
        const audioFile = req.file
        console.log(audioFile)
        req.body.sanitizeInput.path = audioFile?.path
        req.body.sanitizeInput.name = audioFile?.filename 
        req.body.sanitizeInput.long = audioFile?.size
        if (audioFile){
        const data = {
            regDate: new Date(),
            path: audioFile?.path,
            name: audioFile?.filename,
            long: audioFile?.size,  
            order: req.body.sanitizeInput.order }
        
        const em = orm.em.fork()
        const spot = em.create(Spot, data)
        em.persist(spot)
        console.log('El spot creado es: ', spot)
        await em.flush()
        res.status(200).json({ message: 'Spot upload and created successfully', data: {data: audioFile , spot: spot}})}
        else {throw new Error('Error al subir el archivo. ')};
    
    } catch (error:any) {
        res.status(500).json({ message: error.message });
    }

}

async function findOneFile(req: Request, res: Response) {
    try {
        const em = orm.em.fork()

        const id = req.params.id
        const spot = await em.findOneOrFail(Spot, { id })
        const url = 'http://localhost:3001/api/spot/publicSpots/'+spot.name

        res.status(200).json({ message: 'Spot founded sucsesfully', data: {spot, url}})
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

export { sanitizeSpotInput, findAll, findOne, add, update, remove, upload, findOneFile}