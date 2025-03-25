import { z } from 'zod';

export class SchoolValidator {
  static createSchoolValidator: any = z.object({
    name: z.string().min(3).max(255),
    address: z.string().min(3).max(255),
    city: z.string().min(3).max(255),
    state: z.string().min(2).max(2),
    zip: z.string().min(5).max(10),
  });

  static updateSchoolValidator: any = z.object({
    city: z.string().min(3).max(255),
    state: z.string().min(2).max(2),
    zip: z.string().min(5).max(10),
  });
}
