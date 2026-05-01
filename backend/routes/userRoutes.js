import express from 'express';
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  getUsers,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', registerUser);
router.post('/login', authUser);
router.post('/logout', logoutUser);
router.get('/profile', protect, getUserProfile);
router.get('/', protect, getUsers);

export default router;
