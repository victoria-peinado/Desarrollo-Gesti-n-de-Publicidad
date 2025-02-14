import { Request, Response, NextFunction } from 'express'
import { UserRole } from './auth.entity.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const secret = process.env.JWT_SECRET;


const sanitizeAuthInput = (req: Request, res: Response, next: NextFunction) => {
  const { username, password, role } = req.body;

  // If the password exists, hash it; otherwise, leave it unchanged
  if (password) {
    req.body.password = bcrypt.hashSync(password, 10); // Hash password
  }

  // Sanitize the input and assign the necessary fields to sanitizeInput
  req.body.sanitizeInput = { username, password: req.body.password, role };
    // Remove undefined fields
  Object.keys(req.body.sanitizeInput).forEach((key) => {
    if (req.body.sanitizeInput[key] === undefined) {
      delete req.body.sanitizeInput[key];
    }
  });

  next(); // Proceed to the next middleware or controller
};

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


const authorizeUserRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role|| '';
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};


export { verifyToken, authorizeUserRoles, sanitizeAuthInput };
