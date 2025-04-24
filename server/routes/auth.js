import express from 'express';
import { login, signup, verify } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.get('/verify', verify);

export default router;