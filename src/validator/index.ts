import { SchoolValidator } from './school/SchoolValidator';
import { ClassValidator } from './class/classValidators';
import { SectionValidator } from './section/sectionValidator';
import { StudentValidator } from './student/studentValidator';
import { SuperAdminValidator } from './superAdmin/SuperAdminValidator';
import { AuthValidator } from './auth/authValidator';

const validators = {
  SchoolValidator,
  ClassValidator,
  SectionValidator,
  StudentValidator,
  SuperAdminValidator,
  AuthValidator,
};

export default validators;
