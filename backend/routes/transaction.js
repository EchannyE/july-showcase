// backend/routes/transactions.js

import express from 'express';
import {
  createTransaction,
  getTransactions,
  deleteTransaction,
} from '../controllers/transactionController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/transactions - Create new transaction
router.post('/', createTransaction);

// GET /api/transactions - Get user transactions
router.get('/', authMiddleware, getTransactions);

// DELETE /api/transactions/:id - Delete a transaction
router.delete('/:id', deleteTransaction);

export default router;
