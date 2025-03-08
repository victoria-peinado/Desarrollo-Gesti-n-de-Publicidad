import { Request, Response, NextFunction } from 'express'
import { UserRole } from './auth.entity.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { isBlacklisted } from "../shared/blacklist.js";

const secret = process.env.JWT_SECRET;
const tokenBlacklist = new Set<string>(); 

const sanitizeAuthInput = (req: Request, res: Response, next: NextFunction) => {
  const { username, password, role } = req.body;
  const id = req.params.id;

  // If the password exists, hash it; otherwise, leave it unchanged
  if (password) {
    req.body.password = bcrypt.hashSync(password, 10); // Hash password
  }

  // Sanitize the input and assign the necessary fields to sanitizeInput
  req.body.sanitizeInput = { username, password: req.body.password, role, id };

  // Remove undefined fields
  Object.keys(req.body.sanitizeInput).forEach((key) => {
    if (req.body.sanitizeInput[key] === undefined) {
      delete req.body.sanitizeInput[key];
    }
  });
  console.log(req.body.sanitizeInput);

  next(); // Proceed to the next middleware or controller
};

async function verifyToken(req: Request, res: Response, next: NextFunction) {
 const authHeader = req.headers.authorization || req.headers.Authorization;

  if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1]; // Extrae el token después de 'Bearer'

    if (!secret) {
      return res.status(500).json({ message: "JWT_SECRET is not defined" });
    }

    if (isBlacklisted(token)) { // Verifica si el token está en la blacklist
      return res.status(401).json({ message: "Token is blacklisted" });
    }

    try {
      const decodedUser = jwt.verify(token, secret) as { id: string; role: string; exp: number };
      Object.assign(req, { user: decodedUser });
      next(); // Continúa con la siguiente función
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  } else {
    return res.status(401).json({ message: "Authorization header missing or incorrect format" });
  }
}

const authorizeUserRoles = (...allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization || req.headers.Authorization;

      if (typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization header missing or incorrect format' });
      }

      const token = authHeader.split(' ')[1];

      if (!secret) {
        return res.status(500).json({ message: 'JWT secret is not defined' });
      }

      const decoded = jwt.verify(token, secret) as { id: string; role: string };

      if (!allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Access denied' });
      }

      (req as any).user = decoded; // Agregamos el usuario al request con un cast para evitar errores de tipado
      next();
    } catch (error) {
      return res.status(403).json({ message: 'Invalid token' });
    }
  };
};



export { verifyToken, authorizeUserRoles, sanitizeAuthInput };
