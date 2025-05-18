import dbServices from '..';
import { throwError } from '../../config/error';
import { AuthBodyType } from '../../config/zodTypes';
import { ErrorTypes } from '../../utils/errorEnums';
import { SchoolStaffRole_Enum } from '../../utils/interfaces';

export class Auth {
  static login = async (body: AuthBodyType) => {
    const { email, password, schoolId, role } = body;
    let schoolID = schoolId;
    let userId: string = schoolId;
    let userRole = role;

    if (role === SchoolStaffRole_Enum.SUPER_ADMIN) {
      const response: any = await dbServices.SuperAdminDBServices.adminLogin(
        email,
        password,
      );
      userId = response;
      schoolID = response;
      userRole = SchoolStaffRole_Enum.SUPER_ADMIN;
    } else if (role === SchoolStaffRole_Enum.TEACHER) {
      userId = '';
      userRole = SchoolStaffRole_Enum.TEACHER;
      return throwError(ErrorTypes.INVALID_CREDENTIALS);
    } else if (role === SchoolStaffRole_Enum.PARENTS) {
      userId = '';
      userRole = SchoolStaffRole_Enum.PARENTS;
      return throwError(ErrorTypes.INVALID_CREDENTIALS);
    } else if (role === SchoolStaffRole_Enum.STUDENT) {
      userId = '';
      userRole = SchoolStaffRole_Enum.STUDENT;
      return throwError(ErrorTypes.INVALID_CREDENTIALS);
    } else {
      return throwError(ErrorTypes.AUTH_ROLE_NOT_AVAILABLE);
    }
    return {
      email,
      schoolId: schoolID,
      role,
      userId,
    };
  };
}
