import Express from 'express';
import { validateRequest } from '../../middleware/zodValidator';
import Validators from '../../validator';
import Controllers from '../../controllers';
import authMiddleware from '../../middleware/authMiddleware';

const schoolRouter = Express.Router();

schoolRouter.post(
  '/',
  validateRequest(Validators.School.Create()),
  Controllers.School.CreateSchool,
);

schoolRouter.get(
  '/',
  authMiddleware,
  Controllers.School.GetDetails,
)

export default schoolRouter;
