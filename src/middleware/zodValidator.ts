import { Request, Response, NextFunction } from 'express';
import z, { AnyZodObject, ZodError } from 'zod';
import { errorResponse } from '../config/response';

// Validate request body, params, query
export const validateRequest =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sanitizedValues = await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      
      req.body = sanitizedValues.body;
      req.params = sanitizedValues.params;
      req.query = sanitizedValues.query;

      return next();
    } catch (error: any) {
      const validationErrors: { [key: string]: string } = {};
      if (error instanceof ZodError) {
        error.errors.forEach((e) => {
          validationErrors[e.path.join('.')] = e.message;
        });
      }

      errorResponse(res, 400, validationErrors);
    }
  };

// Validate request headers
export const validateRequestHeader =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokenHeader = req.headers['authorization'];
      await schema.parseAsync({ header: { authorization: tokenHeader } });
      req.headers['authorization'] = tokenHeader;
      next();
    } catch (error: any) {
      errorResponse(res, 400, 'Invalid header authorization token missing');
    }
  };
