import express from 'express';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  removeMember,
} from '../controllers/projectController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, admin, createProject)
  .get(protect, getProjects);

router.route('/:id')
  .get(protect, getProjectById)
  .put(protect, admin, updateProject)
  .delete(protect, admin, deleteProject);

router.put('/:id/members/:userId', protect, admin, removeMember);

export default router;
