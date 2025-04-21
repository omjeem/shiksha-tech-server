import { z } from 'zod';
import { StudentValidator } from '../validator/student/studentValidator';

type AddNewStudentsZod = z.infer<typeof StudentValidator.addStudent>;

export type AddStudentBodyType = AddNewStudentsZod['body'];
