import { ErrorMessages, ErrorTypes } from "../utils/errorEnums";

export class CustomError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}

export const handleError = (err: unknown) => {
    if (err instanceof CustomError) {
        return { status: err.status, message: err.message };
    } else if (err instanceof Error) {
        return { status: 500, message: err.message };
    } else {
        return { status: 500, message: 'Internal Server Error' };
    }
};

export function throwError(error: ErrorTypes) {
    const err = ErrorMessages[error]
    throw new CustomError(err.message, err.statusCode)
}
