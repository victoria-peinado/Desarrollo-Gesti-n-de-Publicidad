
import { Request, Response, NextFunction } from 'express'
import { User } from './auth.entity.js'
import { orm } from '../shared/db/orm.js'
import { Price } from '../price/price.entity.js'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { t } from '@mikro-orm/core';
import { env } from '../config_env/config.js'
import { EntityRepository, FilterQuery } from '@mikro-orm/core';
import { validateUniqueFields } from '../shared/db/validations.js';	
import { addToBlacklist } from "../shared/blacklist.js";


const secret = env.JWT_SECRET;


const em = orm.em
em.getRepository(User)

async function validateIdsAndUniques<T extends object>(
    sanitizeInput: Partial<T>
): Promise<{ valid: boolean; messages: string[] }> {
    // Usar el EntityManager definido anteriormente

    const uniqueFieldsMap = {
        username: em.getRepository(User) as unknown as EntityRepository<T>,
    };

    
     const uniqueValidation = await validateUniqueFields(uniqueFieldsMap as Record<keyof T, EntityRepository<T>>, sanitizeInput);

    const allErrors = [ ...uniqueValidation.messages];

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


async function add(req: Request, res: Response) {  
  try {
    const sanitizeInput = req.body.sanitizeInput; // Se asume que ya está sanitizado

    // Llamar a la función de validación antes de continuar
    if (!(await validateRequestInput(res, sanitizeInput))) {
        return;
    }

    // Creación del usuario
    try {
      const auth = em.create(User, sanitizeInput);
      await em.flush();

      // Generar el token si el usuario se creó exitosamente
      if (!secret) {
        return res.status(500).json({ message: 'Server error: secret key not set' });
      }

      const token = jwt.sign(
        { id: auth.id, role: auth.role },
        secret,
        { expiresIn: '5h' }
      );

      res.status(201).json({
        message: 'User created successfully',
        data: { user: auth, token: token }
      });

    } catch (creationError: any) {
      res.status(500).json({ message: 'User creation failed', error: creationError.message });
    }

  } catch (error: any) {
    res.status(500).json({ message: 'Unexpected error', error: error.message });
  }
}



const login= async (req: Request, res: Response) => {
  try {
    const {username, password} = req.body;
    const auth = await em.findOneOrFail(User, {username});
    const valid = bcrypt.compareSync(password, auth.password);
    if(!secret){
      res.status(200).json({message: 'SEECRET'});
    }
    if(valid&&secret){
      const token = jwt.sign(
        {id: auth.id, role: auth.role}, 
        secret, 
        {expiresIn: '5h'})
      res.status(200).json({message: 'User logged in successfully', data: {  user:auth,token: token }});
    }else{
      res.status(401).json({message: 'Invalid credentials', data:{valid: valid}});
    }
  } catch (error: any) {
    res.status(500).json({message: error.message})
  }
}
async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const auth = await em.findOneOrFail(User, { id });
    res.status(200).json({ message: 'User found successfully', data: auth });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
async function findOneByUsername(req: Request, res: Response) {
  try {
    const username = req.params.username;
    const auth = await em.findOneOrFail(User, { username });
    res.status(200).json({ message: 'User found successfully', data: auth });
  }
  catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
const logout =  (req: Request, res: Response) => {
    try {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization header missing or incorrect format" });
    }

    const token = authHeader.split(" ")[1];

    // Decodificar el token para obtener su tiempo de expiración
    const decoded: any = jwt.decode(token);
    const expiresIn = decoded?.exp ? decoded.exp - Math.floor(Date.now() / 1000) : 3600;

    // Agregar el token a la blacklist con su tiempo de expiración
    addToBlacklist(token, expiresIn);

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


async function findAll(req: Request, res: Response) {
  try {
    const auths = await em.find(User, {});
    res.status(200).json({ message: 'Find all Users', data: auths });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}



async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const sanitizeInput = req.body.sanitizeInput;

    // Llamar a la función de validación antes de continuar
    if (!(await validateRequestInput(res, sanitizeInput))) {
        return;
    }

    try {
      const auth = em.getReference(User, id);
      em.assign(auth, sanitizeInput);
      await em.flush();
      res.status(200).json({ message: 'User modified successfully', data: auth });
    } catch (updateError: any) {
      res.status(500).json({ message: 'User update failed', error: updateError.message });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Unexpected error', error: error.message });
  }
}
async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const auth = await em.findOneOrFail(User, { id });
    await em.removeAndFlush(auth);
    res.status(200).json({ message: 'User deleted successfully', data: auth });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}




export { findAll, findOne, add, update, remove,  login, logout, findOneByUsername}