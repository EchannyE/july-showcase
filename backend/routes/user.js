import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  getProfile,
  updateProfile,
  deleteUser,
} from '../controllers/userController.js';

const router = express.Router();


// User profile routes
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.delete('/profile', authMiddleware, deleteUser);

export default router;
export const userRoutes = router;

