import Express, { Request, Response } from 'express';
import { validateRequest } from '../middleware/zodValidator';
import { SchoolValidator } from '../validator/schoolValidator';

const schoolRouter = Express.Router();

schoolRouter.post(
  '/',
  validateRequest(SchoolValidator.createSchoolValidator),
  (req: Request, res: Response): any => {
    // #swagger.tags = ['School']
    // #swagger.summary = 'Create a new school'
    // #swagger.description = 'Create a new school with the provided details'

    /* #swagger.requestBody = {
        required: true,
        schema: { $ref: '#/components/schemas/CreateSchoolRequest' }
    } */

    /* #swagger.responses[200] = {
        description: 'School created successfully',
        schema: { 
            message: 'School created successfully',
            data: {
                id: 1,
                name: 'ABC School',
                address: '123 Main St',
                city: 'New York'
            }
        }
    } */

    const body = req.body;
    console.log('Create School Route', body);
    return res.json({
      message: 'School created successfully',
    });
  },
);

schoolRouter.put(
  '/:id',
  validateRequest(SchoolValidator.updateSchoolValidator),
  (req: Request, res: Response): any => {
    // #swagger.tags = ['School']
    // #swagger.summary = 'Update school details'
    // #swagger.description = 'Update an existing school details'

    /* #swagger.requestBody = {
        required: true,
        schema: { $ref: '#/components/schemas/UpdateSchoolRequest' },
        example : {
            
        }
    } */

    /* #swagger.responses[200] = {
        description: 'School updated successfully',
        schema: { 
            message: 'School updated successfully',
            data: {
                id: 1,
                name: 'Updated School Name',
                address: 'Updated Address',
                city: 'Updated City'
            }
        }
    } */

    const body = req.body;
    console.log('Update School Route', body);
    return res.json({
      message: 'School updated successfully',
    });
  },
);

export default schoolRouter;
