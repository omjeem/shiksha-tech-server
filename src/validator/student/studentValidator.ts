import { z } from 'zod';

export class StudentValidator {
  static addStudent = z.object({
    body: z.object({
      classId: z.string().uuid(),
      sectionId: z.string().uuid().optional(),
      studentData: z.array(
        z.object({
          srNo: z.number().min(1),
          name: z.string().min(2).max(224),
          rollNo: z.number().min(1),
          email: z.string().email().max(224),
          dob: z.coerce.date().optional(),
          schoolId: z.string().uuid().optional(),
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
          admissionClass: z.string().min(1).optional(),
          admissionSection: z.string().min(1).optional(),
          admissionDate: z.coerce.date().optional(),
        })
      )
      .nonempty({message : "Student data should contains atleast one student data"})
      .max(1000, {message : "Student data should not exceed 1000 student data at once"})
      .superRefine((students, ctx) => {
        const srNOSet = new Set<number>();
        const emailSet = new Set<string>();

        students.forEach((student, index) => {

          if (srNOSet.has(student.srNo)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Duplicate Sr No found ${student.srNo}`,
              path: [index, 'srNO']
            })
          } else {
            srNOSet.add(student.srNo);
          }

          if (emailSet.has(student.email)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Duplicate Email found ${student.email}`,
              path: [index, 'email']
            })
          } else {
            emailSet.add(student.email);
          }

        })
      })
    })
  });

  static getAllStudents = z.object({
    body: z.object({}),
    params: z.object({}),
    query: z.object({}),
  });
}
