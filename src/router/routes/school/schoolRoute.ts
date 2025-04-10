import Express from 'express';
import { validateRequest } from '../../../middleware/zodValidator';
import authMiddleware from '../../../middleware/authMiddleware';
import { SchoolController } from '../../../controllers/school/SchoolController';
import SchoolValidator from '../../../validator/school/SchoolValidator';

const schoolRouter = Express.Router();

schoolRouter.post(
  '/',
  validateRequest(SchoolValidator.createSchool()),
  SchoolController.createSchool,
);

schoolRouter.get('/', authMiddleware, SchoolController.getDetails);

export default schoolRouter;
