import Express from 'express';
import { validateRequest } from '../../../middleware/zodValidator';
import validators from '../../../validator';
import controllers from '../../../controllers';

const superAdminRouter = Express.Router();

superAdminRouter.post(
  '/login',
  validateRequest(validators.SuperAdminValidator.login),
  controllers.SuperAdminController.superAdminLogin,
);

export default superAdminRouter;
