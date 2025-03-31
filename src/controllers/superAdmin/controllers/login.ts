import { Request, Response } from "express";
import { errorResponse, successResponse } from "../../../config/response";
import { DBServices } from "../../../dbServices";
import { SchoolStaffRole_Enum } from "../../../utils/interfaces";
import { generateToken } from "../../../config/jwt";

export const superAdminLoginController = async (
    req: Request,
    res: Response,
): Promise<any> => {
    const { email, password } = req.body;
    try {
        const data = await DBServices.SuperAdmin.login(email, password);
        if (!data) {
            return errorResponse(res, 400, 'Invalid Email or password');
        }
        if (!data.isVerified) {
            return errorResponse(res, 400, 'School is under verification process! Please wait for the confirmation');
        }
        const payload = {
            schoolId: data.id,
            role: SchoolStaffRole_Enum.SUPER_ADMIN
        }
        const token = generateToken(payload);
        return successResponse(res, 200, 'Logged in successfully', { token });
    } catch (Err) {
        return errorResponse(res, 500, Err);
    }
};

export const superAdminLoginResponse = () => {
    return {
        path: '/super-admin/',
        method: 'post',
        tags: ['Super-Admin'],
        description: 'Endpoint for Super Admin Login',
        requestBody: {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            email: { type: 'string' },
                            password: { type: 'string' },
                        },
                        example: {
                            email: "contact@abcschool.com",
                            password: "securepass123"
                        },
                    },
                },
            },
        },
        responses: {
            200: {
                description: 'Admin Logged In Successfully',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: { type: 'boolean', example: true },
                                message: {
                                    type: 'string',
                                    example: 'Admin logged in successfully',
                                },
                                data: {
                                    type: 'object',
                                    example: {
                                        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiU1VQRVJfQURNSU4iLCJpYXQiOjE3NDM0NDkxMDgsImV4cCI6MTc0MzQ1MjcwOH0.Hcz9EccThmjuMgmkNPYI2XdsCykBCcm-VVzM1meC-Mw'
                                    }
                                }
                            },
                        },
                    },
                },
            },
            400: {
                description: 'Bad Request',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: { type: 'boolean', example: false },
                                error: { type: 'string', example: 'Invalid Email or password' },
                            },
                        },
                        examples: {
                            'Invalid Email': {
                                value: {
                                    success: false,
                                    error: {
                                        "body.email": "Invalid Email",
                                    }
                                }
                            },
                            'Email And Password Required': {
                                value: {
                                    success: false,
                                    error: {
                                        "body.email": "Required",
                                        "body.password": "Required",
                                    }
                                }
                            },
                            "Invalid Email or Password": {
                                value: {
                                    success: false,
                                    error: "User not found"
                                }
                            },
                            "Verification Pending": {
                                value: {
                                    success: false,
                                    error: "School is under verification process! Please wait for the confirmation"
                                }
                            }
                        }
                    },
                },
            },
        },
    }
}

