import { Router } from 'express';
import { createUser, loginUser } from '../controllers/auth/login.controller';

const router = Router();

// Public routes
router.post('/login', loginUser);
router.post('/createUser', createUser);

export default router;
