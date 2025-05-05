import { SchoolController } from './school/SchoolController';
import { ClassController } from './class/classController';
import { SectionController } from './section/SectionController';
import { StudentController } from './students/StudentController';
import { SuperAdminController } from './superAdmin/SuperAdminController';
import { Auth } from './auth/authController';

const controllers = {
  SchoolController,
  ClassController,
  SectionController,
  StudentController,
  SuperAdminController,
  Auth,
};

export default controllers;
