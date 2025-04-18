import { z } from 'zod';

export class StudentValidator {
  static addStudent = () => {
    return z.object({
      body: z.object({
        srNo: z.number().min(1),
        name: z.string().min(2).max(224),
        rollNo: z.number().min(1),
        email: z.string().email().max(224),
        password: z
          .string()
          .min(8, { message: 'Password must be at least 8 characters long' })
          .regex(/[A-Z]/, {
            message: 'Password must contain at least one uppercase letter',
          })
          .regex(/[a-z]/, {
            message: 'Password must contain at least one lowercase letter',
          }),
        classId: z.string().uuid().optional(),
        sectionId: z.string().uuid().optional(),
        admissionClass: z.string().min(2).optional(),
        admissionSection: z.string().min(2).optional(),
        admissionDate: z.coerce.date(),
      }),
    });
  };
}
