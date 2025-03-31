import { zodToJsonSchema } from 'zod-to-json-schema';
import Validators from '../validator';

// Define schemas based on Zod validators
export const swaggerSchemas = {
  RegisterSchool: zodToJsonSchema(Validators.School.Create()),
  SuperAdminLogin : zodToJsonSchema(Validators.SuperAdmin.login()),
};

// Generate Swagger schema definitions
export function generateSwaggerSchemas() {
  return {
    components: {
      schemas: swaggerSchemas,
    },
  };
}
