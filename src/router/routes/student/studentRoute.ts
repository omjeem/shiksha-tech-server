import express from 'express';
import { StudentController } from '../../../controllers/students/StudentController';
import authMiddleware from '../../../middleware/authMiddleware';
import { validateRequest } from '../../../middleware/zodValidator';
import { StudentValidator } from '../../../validator/student/studentValidator';

const studentRouter = express.Router();

studentRouter.use(authMiddleware);

studentRouter.post(
  '/',
  validateRequest(StudentValidator.addStudent()),
  StudentController.addStudent,
);

export default studentRouter;
