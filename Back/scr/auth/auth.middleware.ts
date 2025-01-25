import { Request, Response, NextFunction } from 'express'
import { check, validationResult } from 'express-validator';
import { UserRole } from './auth.entity.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const secret = process.env.JWT_SECRET;

// Validation rules
function validUser() {
 return [
    // Validar username: debe ser una cadena no vacía
    check('username')
      .isString()
      .withMessage('Username must be a string.') // Si no es un string
      .notEmpty()
      .withMessage('Username is required and cannot be empty.'), // Si está vacío

    // Validar password: debe ser una cadena no vacía
    check('password')
      .isString()
      .withMessage('Password must be a string.') // Si no es un string
      .notEmpty()
      .withMessage('Password is required and cannot be empty.'), // Si está vacío

    // Validar role: debe ser una cadena y un valor válido de UserRole
    check('role')
      .isString()
      .withMessage('Role must be a string.') // Si no es un string
      .notEmpty()
      .withMessage('Role is required and cannot be empty.') // Si está vacío
      .isIn(Object.values(UserRole))
      .withMessage(`Role must be one of the following: ${Object.values(UserRole).join(', ')}`), // Si no es un valor válido
  ];
}
function validLogin() {
  return [
    // Validate username: must be a non-empty string
    check('username')
      .isString()
      .notEmpty()
      .withMessage('Username is required and must be a string.'),

    // Validate password: must be a non-empty string
    check('password')
      .isString()
      .notEmpty()
      .withMessage('Password is required and must be a string.'),
  ];
}

// Middleware to sanitize and process the input
function sanitizeAuthInput(req: Request, res: Response, next: NextFunction) {
  // Sanitize and hash the password
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  req.body.sanitizeInput = {
    username: req.body.username,
    password: hashedPassword,
    role: req.body.role,
  };

  // Remove undefined fields
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



export { validUser, validLogin,sanitizeAuthInput, verifyToken, authorizeUserRoles };