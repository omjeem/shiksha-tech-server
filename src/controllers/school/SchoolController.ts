import { Request, Response } from 'express';
import { errorResponse, successResponse } from '../../config/response';
import { CustomRequest, SchoolStaffRole_Enum } from '../../utils/interfaces';
import { SchoolDBServices } from '../../dbServices/school/SchoolDBServices';

export class SchoolController {
  static createSchool = async (req: Request, res: Response): Promise<any> => {
    const body = req.body;
    try {
      const data = await SchoolDBServices.createSchool(body);
      return successResponse(
        res,
        200,
        'School created successfully we will get back to you soon once your school is verified',
      );
    } catch (Err) {
      return errorResponse(res, 500, Err);
    }
  };

  static getDetails: any = async (req: CustomRequest, res: Response) => {
    try {
      const userRole = req.user.role;
      const schoolId = req.user.schoolId;
      if (!schoolId) {
        return errorResponse(res, 400, 'School Id not found');
      }
      if (userRole !== SchoolStaffRole_Enum.SUPER_ADMIN) {
        return errorResponse(
          res,
          401,
          'Unauthorized User! Only Super Admin can access this route',
        );
      }
      const data = await SchoolDBServices.getDetails(schoolId);
      if (!data) {
        return errorResponse(res, 404, 'School Details not found');
      }

      return successResponse(
        res,
        200,
        'School details fetched successfully',
        data,
      );
    } catch (Err) {
      return errorResponse(res, 500, Err);
    }
  };
}
