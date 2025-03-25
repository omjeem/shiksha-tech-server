import dotenv from 'dotenv';
dotenv.config();
import { z } from 'zod';

const envVarsSchema = z.object({
  PORT: z
    .string()
    .default('8080')
    .transform((str) => parseInt(str, 10)),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string().nonempty(),
  BACKEND_URL : z.string().nonempty()
});

const envVars = envVarsSchema.parse(process.env);

export const envConfigs = {
  port: envVars.PORT,
  jwt_secret: envVars.JWT_SECRET,
  database_url: envVars.DATABASE_URL,
  backend_url : envVars.BACKEND_URL
};
