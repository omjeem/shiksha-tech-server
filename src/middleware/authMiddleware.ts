import { NextFunction, Response } from 'express';
import { errorResponse } from '../config/response';
import { verifyToken } from '../config/jwt';
import { CustomRequest } from '../utils/interfaces';
import { AUTH_TOKEN } from '../utils/constants';
import { handleError, throwError } from '../config/error';
import { ErrorTypes } from '../utils/errorEnums';

const authMiddleware: any = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies[AUTH_TOKEN];
    if (!token) {
      throwError(ErrorTypes.INVALID_TOKEN);
    }
    const decoded: any = verifyToken(token);
    if (!decoded) {
      throwError(ErrorTypes.INVALID_TOKEN);
    }
    console.log('Decoded is >>>> ', decoded);
    req.user = decoded;
    next();
  } catch (Err) {
    const { status, message } = handleError(Err);
    return errorResponse(res, status, message);
  }
};

export default authMiddleware;
