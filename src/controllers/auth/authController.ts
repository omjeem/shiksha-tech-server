import { Request, Response } from 'express';
import { errorResponse, successResponse } from '../../config/response';
import dbServices from '../../dbServices';
import { SchoolStaffRole_Enum } from '../../utils/interfaces';
import { generateToken } from '../../config/jwt';
import { handleError } from '../../config/error';
import { AUTH_TOKEN } from '../../utils/constants';
import { envConfigs } from '../../config/envConfig';

export class Auth {
  static login: any = async (req: Request, res: Response) => {
    try {
      const payload = await dbServices.Auth.login(req.body);
      const token = generateToken(payload);
      res.cookie(AUTH_TOKEN, token, {
        httpOnly: false,        
        secure: false,          
        sameSite: "lax",     
        maxAge: envConfigs.jwt_expires_in,
        path: "/",
      })
      return successResponse(
        res,
        200,
        'User Logged in Successfully',
      );
    } catch (err: any) {
      console.log('Error>>>', err);
      const { status, message } = handleError(err)
      return errorResponse(res, status, message);
    }
  };
}
