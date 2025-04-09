import { z } from 'zod';

class SuperAdminValidator {
  static login = () => {
    return z.object({
      body: z.object({
        email: z.string().email(),
        password: z.string().min(6),
      }),
    });
  };
}

export default SuperAdminValidator;
