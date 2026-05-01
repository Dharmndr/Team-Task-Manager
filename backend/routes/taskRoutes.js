import express from 'express';
import {
  createTask,
  getTasksByProject,
  updateTask,
  deleteTask,
  getDashboardStats,
} from '../controllers/taskController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, admin, createTask);

router.get('/stats', protect, getDashboardStats);
router.get('/project/:projectId', protect, getTasksByProject);

router.route('/:id')
  .put(protect, updateTask)
  .delete(protect, admin, deleteTask);

export default router;
