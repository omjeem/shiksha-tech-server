import { Request, Response } from 'express';
import { errorResponse, successResponse } from '../../config/response';
import dbServices from '../../dbServices';
import { SchoolStaffRole_Enum } from '../../utils/interfaces';
import { generateToken } from '../../config/jwt';

export class Auth {
  static login: any = async (req: Request, res: Response) => {
    try {
      const response = await dbServices.Auth.login(req.body);
      console.log('Response is ', response);
      const payload = {
        id: response.Id,
        role: SchoolStaffRole_Enum.SUPER_ADMIN,
      };
      const token = generateToken(payload);
      return successResponse(res, 200, 'User Logged in Successfully', {
        token,
      });
    } catch (err: any) {
      console.log('Error>>>', err);
      return errorResponse(res, 500, err);
    }
  };
}
