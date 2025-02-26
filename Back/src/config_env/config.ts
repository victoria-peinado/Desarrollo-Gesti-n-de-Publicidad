import dotenv from "dotenv";
import path from "path";

// Obtener el directorio raíz del proyecto
const rootDir = process.cwd();

// Construir la ruta al archivo `.env`
const envPath = path.resolve(rootDir, `.env.${process.env.NODE_ENV}`);


// Cargar variables de entorno
const result = dotenv.config({ path: envPath });

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
