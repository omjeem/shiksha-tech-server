import { NextFunction, Response } from "express";
import { errorResponse } from "../config/response";
import { verifyToken } from "../config/jwt";
import { CustomRequest } from "../utils/interfaces";

const authMiddleware: any = (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return errorResponse(res, 401, 'Token not found');
        }
        const tokenArray = token.split(' ');
        if (tokenArray.length !== 2 || tokenArray[0] !== 'Bearer') {
            return errorResponse(res, 401, 'Invalid Token');
        }
        const decoded: any = verifyToken(tokenArray[1]);
        if (!decoded) {
            return errorResponse(res, 401, 'Unauthorided User Invalid Token');
        }

        req.user = decoded;
        next();
    } catch (Err) {
        return errorResponse(res, 401, Err);
    }
};

export default authMiddleware;