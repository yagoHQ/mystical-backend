import express from 'express';
import environmentRouter from './environment.route';
import scanRouter from './scan.route';
import authRouter from './auth.route';
import commentRouter from './comments.route';

const router = express.Router();

router.use('/api/environments', environmentRouter);
router.use('/api/scans', scanRouter);
router.use('/api/auth', authRouter);
router.use('/api/commments', commentRouter);

export default router;
