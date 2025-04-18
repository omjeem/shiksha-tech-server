import { Request, Response } from 'express';
import { CustomRequest } from '../../utils/interfaces';
import { StudentDBServices } from '../../dbServices/student/StudentDBServices';
import { errorResponse, successResponse } from '../../config/response';
import { SchoolDBServices } from '../../dbServices/school/SchoolDBServices';

export class StudentController {
  static addStudent: any = async (req: CustomRequest, res: Response) => {
    console.log('addStudent');
    try {
      const body = req.body;
      const schoolId = req.user.schoolId;
      await SchoolDBServices.isSchoolExists(schoolId);
      const data = await StudentDBServices.createStudent(schoolId, body);
      return successResponse(res, 200, 'Student created successfully', data);
    } catch (Err) {
      console.log('Error while creating the student', Err);
      return errorResponse(res, 400, Err);
    }
  };
}
