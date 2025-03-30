// Import required libraries for file operations
const fs = require('fs');
const path = require('path');

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

// Load endpoint documentation
let endpointDocs;
try {
  endpointDocs = require('./config/swagger-endpoints');
  console.log("Loaded endpoint docs successfully");
} catch (err) {
  console.error("Error loading endpoint documentation:", err.message);
  console.error(err.stack);
  endpointDocs = {};
}

// Create the OpenAPI document
const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Shiksha Tech API",
    description: "API Endpoints for Shiksha Tech School Management System"
  },
  servers: [
    {
      url: `http://localhost:8080/api/v1`,
      description: "Local server"
    },
    {
      url: `https://shiksha-tech-server.onrender.com/api/v1`,
      description: "Development server"
    }
  ],
  tags: [
    {
      name: "User",
      description: "User management endpoints"
    },
    {
      name: "School",
      description: "School management endpoints"
    }
  ],
  paths: {},
  components: {
    ...swaggerSchemas.components,
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    }
  }
};

// Add all endpoint documentation from the endpointDocs
if (endpointDocs && Object.keys(endpointDocs).length > 0) {
  console.log(`Processing ${Object.keys(endpointDocs).length} endpoints`);
  
  Object.entries(endpointDocs).forEach(([key, endpoint]) => {
    
    if (!endpoint || typeof endpoint !== 'object') {
      console.error(`Invalid endpoint definition for ${key}:`, endpoint);
      return;
    }
    
    const { path, method, ...rest } = endpoint;
    
    if (!path || !method) {
      console.error(`Missing path or method for endpoint ${key}:`, endpoint);
      return;
    }
    
    console.log(`Adding documentation for ${method.toUpperCase()} ${path}`);
    
    if (!swaggerDocument.paths[path]) {
      swaggerDocument.paths[path] = {};
    }
    
    swaggerDocument.paths[path][method] = rest;
  });
} else {
  console.error("No endpoint documentation found or loaded!");
}

// Write the swagger document to file
try {
  const outputFile = path.resolve(__dirname, 'swagger-output.json');
  fs.writeFileSync(outputFile, JSON.stringify(swaggerDocument, null, 2));
  console.log('Swagger documentation generated successfully!');
} catch (err) {
  console.error("Error writing swagger output file:", err);
}

