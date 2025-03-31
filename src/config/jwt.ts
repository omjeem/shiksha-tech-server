import jwt from "jsonwebtoken"
import { envConfigs } from "./envConfig";

export const generateToken = (payload: any) => {
    return jwt.sign(payload, envConfigs.jwt_secret, { expiresIn: envConfigs.jwt_expires_in });
}

export const verifyToken = (token: string) => {
    return jwt.verify(token, envConfigs.jwt_secret);
}

