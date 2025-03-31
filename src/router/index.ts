import Express from 'express';
import schoolRouter from './routes/schoolRoute';
import superAdminRouter from './routes/superAdminRoutes';

const router = Express.Router();

router.use('/school', schoolRouter);
router.use('/super-admin', superAdminRouter);

export default router;
