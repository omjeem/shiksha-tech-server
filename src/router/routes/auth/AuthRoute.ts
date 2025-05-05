import express from 'express';
import validators from '../../../validator';
import { validateRequest } from '../../../middleware/zodValidator';
import controllers from '../../../controllers';

const router = express.Router();

router.post(
  '/login',
  validateRequest(validators.AuthValidator.login),
  controllers.Auth.login,
);

export default router;
