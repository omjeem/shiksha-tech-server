import { string, z } from 'zod';
import { StudentGender_Enum } from '../../utils/interfaces';

export class StudentValidator {
  static addStudent = z.object({
    body: z.object({
      classId: z.string().uuid(),
      sectionId: z.string().uuid(),
      studentData: z
        .array(
          z.object({
            srNo: z.number().min(1),
            name: z.string().min(2).max(224),
            rollNo: z.number().min(1),
            email: z.string().email().max(224),
            dob: z.coerce.date().optional(),
            address: z.string().min(2),
            gender: z.enum([
              ...Object.values(StudentGender_Enum) as [string, ...string[]]
            ]),
            contactNumber : z.string().optional(),
            password: z
              .string().optional(),
            schoolId: z.string().optional(),
            classId: z.string().uuid().optional(),
            sectionId: z.string().uuid().optional(),
            admissionClass: z.string().optional(),
            admissionSection: z.string().optional(),
            admissionDate: z.coerce.date().optional(),
            fatherName: z.string().min(2),
            fatherContact: z.string().min(2),
            fatherEmail: z.string().min(2),
            motherName: z.string().min(2),
            motherContact: z.string().min(2),
            motherEmail: z.string().min(2),
          }),
        )
        .nonempty({
          message: 'Student data should contains atleast one student data',
        })
        .max(1000, {
          message: 'Student data should not exceed 1000 student data at once',
        })
        .superRefine((students, ctx) => {
          const srNOSet = new Set<number>();
          const emailSet = new Set<string>();

          students.forEach((student, index) => {
            if (srNOSet.has(student.srNo)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Duplicate Sr No found ${student.srNo}`,
                path: [index, 'srNO'],
              });
            } else {
              srNOSet.add(student.srNo);
            }

            if (emailSet.has(student.email)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Duplicate Email found ${student.email}`,
                path: [index, 'email'],
              });
            } else {
              emailSet.add(student.email);
            }
          });
        }),
    }),
  });

  static getAllStudents = z.object({
    body: z.object({}),
    params: z.object({}),
    query: z.object({}),
  });
}
