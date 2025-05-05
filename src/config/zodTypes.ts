import { z } from 'zod';
import { StudentValidator } from '../validator/student/studentValidator';
import validators from '../validator';

type AddNewStudentsZod = z.infer<typeof StudentValidator.addStudent>;
type AuthBodyZod = z.infer<typeof validators.AuthValidator.login>;

export type AddStudentBodyType = AddNewStudentsZod['body'];
export type AuthBodyType = AuthBodyZod['body'];
