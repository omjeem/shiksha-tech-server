import { z } from 'zod';
import { SchoolStaffRole_Enum } from '../../utils/interfaces';

export class AuthValidator {
  static login = z.object({
    body: z.object({
      email: z.string(),
      password: z.string(),
      schoolId: z.string().optional(),
      role: z.enum([
        ...(Object.values(SchoolStaffRole_Enum) as [string, ...string[]]),
      ]),
    }),
  });
}
