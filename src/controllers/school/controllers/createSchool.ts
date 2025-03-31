import { Request, Response } from 'express';
import { errorResponse, successResponse } from '../../../config/response';
import { DBServices } from '../../../dbServices';

export const createSchoolController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  const body = req.body;
  try {
    const data = await DBServices.School.CreateSchool(body);
    return successResponse(res, 200, 'School created successfully we will get back to you soon once your school is verified');
  } catch (Err) {
    return errorResponse(res, 500, Err);
  }
};

export function createSchoolResponse() {
  return {
    path: '/school/',
    method: 'post',
    tags: ['School'],
    description: 'Endpoint to create a school',
    // parameters: [
    //   {
    //     name: 'schoolId',
    //     in: 'path',
    //     required: true,
    //     schema: {
    //       type: 'string',
    //       enum: ['Public', 'Private', 'Charter'],
    //     },
    //     description: 'Unique identifier for the school'
    //   },
    //   {
    //     name: 'includeStudents',
    //     in: 'query',
    //     required: false,
    //     schema: {
    //       type: 'boolean',
    //       default: false
    //     },
    //     description: 'Whether to include students in the response'
    //   }
    // ],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/RegisterSchool' },
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
                data: { $ref: '#/components/schemas/RegisterSchool' },
              },
            },
            examples: {
              'Standard User': {
                value: {
                  message: 'User registered successfully',
                  data: {
                    id: 1,
                    name: 'John Doe',
                    email: 'john@example.com',
                  },
                },
              },
              'New User': {
                value: {
                  message: 'New User registered successfully',
                  data: {
                    id: 2,
                    name: 'Jane Doe',
                    email: 'jane@example.com',
                  },
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
