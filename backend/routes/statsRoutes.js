import express from 'express';
import { getMonthlySpending } from '../controllers/statsController.js';
import  authMiddleware  from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected route for spending stats
router.get('/monthly', authMiddleware, getMonthlySpending);

export default router;
