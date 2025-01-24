import 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
        [key: string]: any; // Esto permite que `user` tenga otras propiedades si es necesario.
      };
    }
  }
}