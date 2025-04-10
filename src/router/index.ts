import Express from 'express';
import schoolRouter from './routes/school/schoolRoute';
import superAdminRouter from './routes/superAdmin/superAdminRoutes';
import classRouter from './routes/class/classRoute';
import sectionRouter from './routes/section/sectionRoute';

const router = Express.Router();

router.use('/school', schoolRouter);
router.use('/super-admin', superAdminRouter);
router.use("/class", classRouter)
router.use("/section", sectionRouter)

export default router;
