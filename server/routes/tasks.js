import express from 'express';
import { recommendTasks, getTasks, acceptTask, rejectTask, getAcceptedTasks, completeTask } from '../controllers/taskController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.post('/recommend', authMiddleware, recommendTasks);
router.get('/', authMiddleware, getTasks);
router.put('/:id/accept', authMiddleware, acceptTask);
router.put('/:id/reject', authMiddleware, rejectTask);
router.get('/accepted', authMiddleware, getAcceptedTasks);
router.put('/:id/complete', authMiddleware, completeTask);

export default router;