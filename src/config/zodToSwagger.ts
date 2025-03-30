// import { z, ZodObject, ZodRawShape, ZodSchema, ZodTypeAny } from "zod";

// export function generateSwaggerDocsFromZod(schema: ZodObject<ZodRawShape>) {
//     const swaggerDocs: any = {};

//     // Extract body schema
//     if (schema.shape.body) {
//         swaggerDocs.requestBody = {
//             required: true,
//             content: {
//                 "application/json": {
//                     schema: zodToSwagger(schema.shape.body),
//                 },
//             },
//         };
//     }

//     // Extract query parameters
//     if (schema.shape.query) {
//         swaggerDocs.parameters = swaggerDocs.parameters || [];
//         Object.entries(schema.shape.query.shape).forEach(([key, value]) => {
//             swaggerDocs.parameters.push({
//                 name: key,
//                 in: "query",
//                 required: !value.isOptional(),
//                 schema: zodToSwagger(value),
//             });
//         });
//     }

//     // Extract path parameters
//     if (schema.shape.params) {
//         swaggerDocs.parameters = swaggerDocs.parameters || [];
//         Object.entries(schema.shape.params.shape).forEach(([key, value]) => {
//             swaggerDocs.parameters.push({
//                 name: key,
//                 in: "path",
//                 required: true, // Path parameters are always required
//                 schema: zodToSwagger(value),
//             });
//         });
//     }

//     return swaggerDocs;
// }

// // Helper function to convert Zod types to Swagger schemas
// function zodToSwagger(zodSchema: ZodTypeAny) {
//     if (zodSchema instanceof z.ZodString) {
//         return { type: "string", example: "example" };
//     } else if (zodSchema instanceof z.ZodNumber) {
//         return { type: "number", example: 123 };
//     } else if (zodSchema instanceof z.ZodBoolean) {
//         return { type: "boolean", example: true };
//     } else if (zodSchema instanceof z.ZodEnum) {
//         return { type: "string", enum: zodSchema.options };
//     } else if (zodSchema instanceof z.ZodObject) {
//         return {
//             type: "object",
//             properties: Object.fromEntries(
//                 Object.entries(zodSchema.shape).map(([key, value]) => [key, zodToSwagger(value)])
//             ),
//         };
//     } else if (zodSchema instanceof z.ZodArray) {
//         return { type: "array", items: zodToSwagger(zodSchema.element) };
//     } else if (zodSchema instanceof z.ZodOptional) {
//         return { ...zodToSwagger(zodSchema.unwrap()), nullable: true };
//     }
//     return { type: "string" }; // Default fallback
// }
