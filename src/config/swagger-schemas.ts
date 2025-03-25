import { UserValidator } from '../validator/userValidator';
import { SchoolValidator } from '../validator/schoolValidator';
import { zodToJsonSchema } from 'zod-to-json-schema';

// Define schemas based on Zod validators
export const swaggerSchemas = {
  RegisterUserRequest: zodToJsonSchema(UserValidator.registerUserValidator),
  LoginUserRequest: zodToJsonSchema(UserValidator.loginUserValidator),
  CreateSchoolRequest: zodToJsonSchema(SchoolValidator.createSchoolValidator),
  UpdateSchoolRequest: zodToJsonSchema(SchoolValidator.updateSchoolValidator),
};

// Generate Swagger schema definitions
export function generateSwaggerSchemas() {
  return {
    components: {
      schemas: swaggerSchemas,
    },
  };
}
