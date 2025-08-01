import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { updateProfile, getProfile } from '../controllers/userController.js';
import { deleteUser } from '../controllers/profileController.js';

const router = express.Router();

router.get('/', authMiddleware, getProfile);

router.put('/', authMiddleware, updateProfile); // must include authMiddleware

router.delete('/', authMiddleware, deleteUser);


export default router;
