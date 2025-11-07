import express from 'express';
import { register, login, refresh, getMe, logout } from '../controllers/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refresh);
router.get('/me', getMe);

export default router;