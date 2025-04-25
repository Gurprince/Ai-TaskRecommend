import express from 'express';
import {
  recommendTasks,
  getTasks,
  acceptTask,
  rejectTask,
  getAcceptedTasks,
  completeTask,
  analyzeTask,
  getTaskById,
  deleteTask,
} from '../controllers/taskController.js';
import authMiddleware from '../middleware/auth.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/recommend', authMiddleware, recommendTasks);
router.get('/', authMiddleware, getTasks);
router.put('/:id/accept', authMiddleware, acceptTask);
router.put('/:id/reject', authMiddleware, rejectTask);
router.get('/accepted', authMiddleware, getAcceptedTasks);
router.put('/:id/complete', authMiddleware, completeTask);
router.post('/:id/analyze', authMiddleware, upload.single('file'), analyzeTask);
router.get('/:id', authMiddleware, getTaskById);
router.delete('/:id', authMiddleware, deleteTask);

export default router;