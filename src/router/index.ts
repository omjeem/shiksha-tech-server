import Express from 'express';
import userRouter from './userRoute';
import schoolRouter from './schoolRoute';

const router = Express.Router();

router.use('/user', userRouter);
router.use('/school', schoolRouter);

export default router;
