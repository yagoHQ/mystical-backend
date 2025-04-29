import express from 'express';
import environmentRouter from './environment.route';
import scanRouter from './scan.route';

const router = express.Router();

router.use('/api/environments', environmentRouter);
router.use('/api/scans', scanRouter);

export default router;
