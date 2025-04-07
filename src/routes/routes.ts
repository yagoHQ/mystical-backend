import express from 'express';
import statusController from '../controllers/status/status';

const router = express.Router();

router.get('/status', statusController.status);

export default router;
