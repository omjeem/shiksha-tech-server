import { z } from 'zod';

export class SuperAdminValidator {
  static login = z.object({
    body: z.object({
      email: z.string().email(),
      password: z.string().min(6),
    }),
  });
}
