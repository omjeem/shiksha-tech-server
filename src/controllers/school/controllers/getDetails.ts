import { Request, Response } from "express";
import { errorResponse, successResponse } from "../../../config/response";
import { DBServices } from "../../../dbServices";
import { CustomRequest, SchoolStaffRole_Enum } from "../../../utils/interfaces";

export const getDetailsController: any = async (req: CustomRequest, res: Response) => {
    try {
        const userRole = req.user.role;
        const schoolId = req.user.schoolId;
        if (!schoolId) {
            return errorResponse(res, 400, 'School Id not found');
        }
        if (userRole !== SchoolStaffRole_Enum.SUPER_ADMIN) {
            return errorResponse(res, 401, 'Unauthorized User! Only Super Admin can access this route');
        }
        const data = await DBServices.School.GetDetails(schoolId);
        if (!data) {
            return errorResponse(res, 404, 'School Details not found');
        }
       
        return successResponse(res, 200, 'School details fetched successfully', data);
    } catch (Err) {
        return errorResponse(res, 500, Err);
    }
}

export function getSchoolDetailsResponse() {
    return {
        path: '/school/',
        method: 'get',
        tags: ['School'],
        description: 'Endpoint to get School Details',
        security: [
            {
                "bearerAuth": []
            }
        ],
        requestBody: {
            required: true,
            content: {
                'application/json': {
                    example: {
                        schoolName: 'ABC School',
                        address: '123 Education Street',
                        websiteLink: 'https://abcschool.com',
                        contactNumber: '1234567890',
                        contactEmail: 'contact@abcschool.com',
                        superAdminName: 'John Doe',
                        superAdminPassword: 'securepass123',
                        superAdminEmail: 'admin@abcschool.com',
                        superAdminContact: '9876543210',
                        board: 'CBSE',
                    },
                },
            },
        },
        responses: {
            200: {
                description: 'School created successfully',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: { type: 'boolean', example: true },
                                message: {
                                    type: 'string',
                                    example: 'School created successfully',
                                },
                                data: {
                                    schoolName: 'ABC School',
                                    address: '123 Education Street',
                                    websiteLink: 'https://abcschool.com',
                                    contactNumber: '1234567890',
                                    contactEmail: 'contact@abcschool.com',
                                    superAdminName: 'John Doe',
                                    superAdminPassword: 'securepass123',
                                    superAdminEmail: 'admin@abcschool.com',
                                    superAdminContact: '9876543210',
                                    board: 'CBSE',
                                },
                            },
                        },
                    },
                },
            },
            500: {
                description: 'Internal Server Error',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: { type: 'boolean', example: false },
                                error: { type: 'string', example: 'Error Occured' },
                            },
                        },
                        examples: {
                            'Server Error': {
                                value: {
                                    message: 'Internal Server Error',
                                    error: {
                                        message: 'Error Occured',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    };
}