
export enum ErrorTypes {
    INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
    SCHOOL_UNVERIFIED = 'SCHOOL_UNVERIFIED',
    USER_NOT_FOUND = 'USER_NOT_FOUND',
    ACCESS_DENIED = 'ACCESS_DENIED',
    INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
    AUTH_ROLE_NOT_AVAILABLE = 'AUTH_ROLE_NOT_AVAILABLE',
    INVALID_TOKEN = "INVALID_TOKEN"
}

export const ErrorMessages: Record<ErrorTypes, { message: string; statusCode: number }> = {
    [ErrorTypes.INVALID_TOKEN]: {
        message: 'Expired or invalid token',
        statusCode: 498,
    },
    [ErrorTypes.INVALID_CREDENTIALS]: {
        message: 'Invalid Credentials',
        statusCode: 401,
    },
    [ErrorTypes.SCHOOL_UNVERIFIED]: {
        message: 'School is under verification',
        statusCode: 403,
    },
    [ErrorTypes.USER_NOT_FOUND]: {
        message: 'User not found',
        statusCode: 404,
    },
    [ErrorTypes.ACCESS_DENIED]: {
        message: 'Access denied',
        statusCode: 403,
    },
    [ErrorTypes.INTERNAL_SERVER_ERROR]: {
        message: 'Internal Server Error',
        statusCode: 500,
    },
    [ErrorTypes.AUTH_ROLE_NOT_AVAILABLE]: {
        message: 'This auth role is not currently available',
        statusCode: 400,
    },
};
