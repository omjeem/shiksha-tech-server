import Express from 'express';
import { validateRequest } from '../../middleware/zodValidator';
import Validators from '../../validator';
import Controllers from '../../controllers';

const superAdminRouter = Express.Router();

superAdminRouter.post(
    '/',
    validateRequest(Validators.SuperAdmin.login()),
    Controllers.SuperAdmin.login,
);


export default superAdminRouter;
