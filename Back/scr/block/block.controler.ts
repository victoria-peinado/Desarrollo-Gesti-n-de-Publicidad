
import { Request, Response, NextFunction } from 'express'
import { Block } from './block.entity.js'
import { orm } from '../shared/db/orm.js'
import { Price } from '../price/price.entity.js'


const em = orm.em
em.getRepository(Block)

function sanitizeBlockInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizeInput = {
    numBlock: req.body.numBlock,
    startTime: req.body.startTime,
  };

  Object.keys(req.body.sanitizeInput).forEach((key) => {
    if (req.body.sanitizeInput[key] === undefined) {
      delete req.body.sanitizeInput[key];
    }
  });

  next();
}

async function findAll(req: Request, res: Response) {
  try {
    const blocks = await em.find(Block, {},{populate:['prices']});
    res.status(200).json({ message: 'Find all Blocks', data: blocks });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const block = await em.findOneOrFail(Block, { id });
    res.status(200).json({ message: 'Block found successfully', data: block });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const block = em.create(Block, req.body.sanitizeInput);
    await em.flush();
    res.status(201).json({ message: 'Block created successfully', data: block });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const block = em.getReference(Block, id);
    em.assign(block, req.body.sanitizeInput);
    await em.flush();
    res.status(200).json({ message: 'Block modified successfully', data: block });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const block = await em.findOneOrFail(Block, { id }, { populate: ['prices'] });
    await em.removeAndFlush(block);
    res.status(200).json({ message: 'Block deleted successfully', data: block });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function removeAll(req: Request, res: Response) {
  try {
    const blocks = await em.find(Block, {}, { populate: ['prices'] });
    em.remove(blocks)
    await em.flush()

    res.status(200).json({message: 'All blocks removed', data: blocks})
  }catch (error: any) {
        res.status(500).json({message: error.message})
    }
  
}

//FUNCIONES PARA CREAR AUTOMATICAMENTE TODOS LOS BLOQUES

function formatoHora(hora: Date): string {
  const horas = hora.getHours().toString().padStart(2, '0');
  const minutos = hora.getMinutes().toString().padStart(2, '0');
  const segundos = hora.getSeconds().toString().padStart(2, '0');
  return `${horas}:${minutos}:${segundos}`;
}

async  function addAll(req: Request, res: Response) {
     try {
        let hora = new Date('2023-01-01T00:00:00')
        let blocks: Block[] = [];
        for(let x=0; x<=48 ;x=x+1){
          req.body.numBlock = x.toString();
          req.body.startTime = formatoHora(hora)
          hora = new Date(hora.getTime() + 30 * 60 * 1000)
          let block = em.create(Block, req.body)
          blocks.push(block)
    } 
    await em.flush()
    res.status(200).json({message: 'All blocks created sucessfully', data: blocks})
  } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}

//FIN DE FUNCIONES PARA CREAR TODOS LOS BLOQUES


export {sanitizeBlockInput,  findAll, findOne, add, update, remove, removeAll, addAll}