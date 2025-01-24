
import { Request, Response, NextFunction } from 'express'
import { User } from './auth.entity.js'
import { orm } from '../shared/db/orm.js'
import { Price } from '../price/price.entity.js'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { t } from '@mikro-orm/core';
import { config } from "dotenv";
config() //env variables
const databaseName = process.env.DATABASE_NAME;
const databaseUrl = process.env.CONNECTION_STRING;
const secret = process.env.JWT_SECRET;
console.log(secret)

const em = orm.em
em.getRepository(User)

function sanitizeAuthInput (req: Request, res: Response, next: NextFunction) {
  const hashedPassword= bcrypt.hashSync(req.body.password, 10) //Encripta la contraseña
  req.body.sanitizeInput = {
    username: req.body.username,
    password: hashedPassword,
    role: req.body.role,
    
  };

  Object.keys(req.body.sanitizeInput).forEach((key) => {
    if (req.body.sanitizeInput[key] === undefined) {
      delete req.body.sanitizeInput[key];
    }
  });

  next();
}

async function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1]; // Extrae el token después de 'Bearer'
    
    if (typeof token === 'string') {
      if (!secret) {
        return res.status(500).json({ message: 'JWT_SECRET is not defined' });
      }

      try {
        const decodeduser = await jwt.verify(token, secret); // Usamos await para esperar la verificación
        Object.assign(req, { user: decodeduser });
        next(); // Continúa con la siguiente función
      } catch (err) {
        return res.status(403).json({ message: 'Invalid token' });
      }
    } else {
      return res.status(400).json({ message: 'Token format is incorrect' });
    }
  } else {
    return res.status(401).json({ message: 'Authorization header missing or incorrect format' });
  }
}


async function authorizeUserRoles(req: Request, res: Response, next: NextFunction, ...allowedRoles: string[]): Promise<void> {
  console.log(req.user)
  const userRole = req.user?.role || ''; 
  if (!allowedRoles.includes(userRole)) {
    res.status(403).json({ message: 'Access denied' });
    return;
  }

  next();
}

async function add(req: Request, res: Response) {
   try {
    const auth = em.create(User, req.body.sanitizeInput);
    await em.flush();
    res.status(201).json({ message: 'User created successfully', data: auth });
  } catch (error: any) {
    res.status(500).json({ message: error.message }); 
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
        {expiresIn: '1h'})
      res.status(200).json({message: 'User logged in successfully', data: {  token: token }});
    }else{
      res.status(401).json({message: 'Invalid credentials', data:{valid: valid, secret: secret}});
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
const logout= async (req: Request, res: Response) => {
  res.status(200).json({message: 'User logged out successfully'});
}



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
    const auth = em.getReference(User, id);
    em.assign(auth, req.body.sanitizeInput);
    await em.flush();
    res.status(200).json({ message: 'User modified successfully', data: auth });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
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



export {sanitizeAuthInput, findAll, findOne, add, update, remove,  login, logout, verifyToken, authorizeUserRoles}