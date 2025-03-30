import Express from 'express';
import schoolRouter from './routes/schoolRoute';

const router = Express.Router();

router.use('/school', schoolRouter);

export default router;
