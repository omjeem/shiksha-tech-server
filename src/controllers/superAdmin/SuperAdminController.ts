import { Request, Response } from 'express';
import { errorResponse, successResponse } from '../../config/response';
import { generateToken } from '../../config/jwt';
import { SchoolStaffRole_Enum } from '../../utils/interfaces';
import { SuperAdminDBServices } from '../../dbServices/superAdmin/SuperAdminDBServices';

export class SuperAdminController {
  static superAdminLogin = async (
    req: Request,
    res: Response,
  ): Promise<any> => {
    const { email, password } = req.body;
    try {
      const data = await SuperAdminDBServices.adminLogin(email, password);
      if (!data) {
        return errorResponse(res, 400, 'Invalid Email or password');
      }
      if (!data.isVerified) {
        return errorResponse(
          res,
          400,
          'School is under verification process! Please wait for the confirmation',
        );
      }
      const payload = {
        schoolId: data.id,
        role: SchoolStaffRole_Enum.SUPER_ADMIN,
      };
      const token = generateToken(payload);
      return successResponse(res, 200, 'Logged in successfully', { token });
    } catch (Err) {
      return errorResponse(res, 500, Err);
    }
  };
}
