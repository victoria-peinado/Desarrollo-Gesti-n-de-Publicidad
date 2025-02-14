import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Definir la ruta del archivo .env
const envPath = path.resolve(__dirname, `../../environments/.env.${process.env.NODE_ENV}`);
console.log("Loading environment from:", envPath); 

const result = dotenv.config({ path: envPath });

// Verifica si hubo un error cargando el archivo .env
if (result.error) {
  console.error("Error loading .env file:", result.error);
} else {
  console.log("Environment variables loaded successfully");
}

export const env = {
  PORT: process.env.PORT,
  FRONTEND_URL: process.env.FRONTEND_URL,
  DATABASE_NAME: process.env.DATABASE_NAME,
  CONNECTION_STRING: process.env.CONNECTION_STRING,
  JWT_SECRET: process.env.JWT_SECRET
};

console.log("Loaded ENV variables:", env); 