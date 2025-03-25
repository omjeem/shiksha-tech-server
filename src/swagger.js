// Import required libraries
const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });
// Need to register ts-node to handle TypeScript files
require('ts-node/register');

// Load the schema definitions
let swaggerSchemas;
try {
  const { generateSwaggerSchemas } = require('./config/swagger-schemas');
  swaggerSchemas = generateSwaggerSchemas();
} catch (err) {
  console.log("Error loading schema definitions:", err);
  swaggerSchemas = { components: { schemas: {} } };
}

const doc = {
  info: {
    version: '1.0.0',
    title: 'Shiksha Tech API',
    description: 'API Endpoints for Shiksha Tech School Management System'
  },
  servers: [
    {
      url: 'http://localhost:3000/api/v1',
      description: 'Development server'
    }
  ],
  tags: [
    {
      name: 'User',
      description: 'User management endpoints'
    },
    {
      name: 'School',
      description: 'School management endpoints'
    }
  ],
  components: {
    ...swaggerSchemas.components,
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  definitions: {}
};

const outputFile = './swagger-output.json';
// Point to the TypeScript source files
const routes = ['./router/index.ts'];

const options = {
  disableLogs: true,
  useCache: false,
  autoHeaders: true,
  autoQuery: true,
  autoBody: true,
  // Load the TypeScript files directly using ts-node
  handlebars: {
    enableCache: false
  }
};

try {
  swaggerAutogen(outputFile, routes, doc, options).then(() => {
    console.log('Swagger documentation generated successfully!');
  });
} catch (err) {
  console.log("Error in generating swagger documentation: ", err);
}

