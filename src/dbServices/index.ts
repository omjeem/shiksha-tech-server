import { ClassDBServices } from './class/ClassDBServices';
import { SchoolDBServices } from './school/SchoolDBServices';
import { SectionDBServices } from './section/SectionDBServices';
import { StudentDBServices } from './student/StudentDBServices';
import { SuperAdminDBServices } from './superAdmin/SuperAdminDBServices';
import { Auth } from './auth/AuthDBServices';

const dbServices = {
  ClassDBServices,
  SchoolDBServices,
  SectionDBServices,
  StudentDBServices,
  SuperAdminDBServices,
  Auth,
};

export default dbServices;
