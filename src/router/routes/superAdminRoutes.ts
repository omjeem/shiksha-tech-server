import Express from 'express';
import { validateRequest } from '../../middleware/zodValidator';
import { SuperAdminController } from '../../controllers/superAdmin/SuperAdminController';
import SuperAdminValidator from '../../validator/superAdmin/SuperAdminValidator';

const superAdminRouter = Express.Router();

superAdminRouter.post(
  '/',
  validateRequest(SuperAdminValidator.login()),
  SuperAdminController.superAdminLogin,
);

export default superAdminRouter;
