import { z } from 'zod';

export class UserValidator {
  static registerUserValidator: any = z.object({
    name: z.string().min(3).max(255),
    email: z.string().email(),
    password: z.string().min(8).max(255),
  });

  static loginUserValidator: any = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(255),
  });
}
