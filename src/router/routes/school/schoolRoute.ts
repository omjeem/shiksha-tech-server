import Express from 'express';
import { validateRequest } from '../../../middleware/zodValidator';
import authMiddleware from '../../../middleware/authMiddleware';
import validators from '../../../validator';
import controllers from '../../../controllers';

const schoolRouter = Express.Router();

schoolRouter.post(
  '/',
  validateRequest(validators.SchoolValidator.createSchool()),
  controllers.SchoolController.createSchool,
);
schoolRouter.get('/list', controllers.SchoolController.getSchoolList);

schoolRouter.get('/', authMiddleware, controllers.SchoolController.getDetails);

export default schoolRouter;
