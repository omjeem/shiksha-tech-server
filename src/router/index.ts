import Express from 'express';
import schoolRouter from './routes/school/schoolRoute';
import superAdminRouter from './routes/superAdmin/superAdminRoutes';
import classRouter from './routes/class/classRoute';
import sectionRouter from './routes/section/sectionRoute';
import studentRouter from './routes/student/studentRoute';
import authRouter from './routes/auth/AuthRoute';

const router = Express.Router();

router.use('/auth', authRouter);
router.use('/school', schoolRouter);
router.use('/super-admin', superAdminRouter);
router.use('/class', classRouter);
router.use('/section', sectionRouter);
router.use('/student', studentRouter);

export default router;
