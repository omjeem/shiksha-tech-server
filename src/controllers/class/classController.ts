import { Request, Response } from 'express';
import { errorResponse, successResponse } from '../../config/response';
import { ClassDBServices } from '../../dbServices/class/ClassDBServices';
import { CustomRequest } from '../../utils/interfaces';

export class ClassController {
  static createClass: any = async (req: CustomRequest, res: Response) => {
    try {
      const body = req.body;
      const schoolId = req.user.schoolId;
      const data = await ClassDBServices.createClass(body, schoolId);
      return successResponse(res, 200, 'Class created successfully', data);
    } catch (err) {
      return errorResponse(res, 400, err);
    }
  };

  static getAllClasses: any = async (req: CustomRequest, res: Response) => {
    try {
      console.log('User is >>> ', req.user);
      const schoolId = req.user.schoolId;
      if (!schoolId) {
        return errorResponse(res, 400, 'School Id not found');
      }
      const data = await ClassDBServices.getALLCLasses(schoolId);
      return successResponse(res, 200, 'Classes fetched successfully', data);
    } catch (Err) {
      return errorResponse(res, 400, Err);
    }
  };
}
