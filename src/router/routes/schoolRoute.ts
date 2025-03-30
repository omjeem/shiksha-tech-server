import Express from 'express';
import { validateRequest } from '../../middleware/zodValidator';
import Validators from '../../validator';
import Controllers from '../../controllers';

const schoolRouter = Express.Router();

schoolRouter.post(
  '/',
  validateRequest(Validators.School.Create()),
  Controllers.School.CreateSchool,
);

export default schoolRouter;
