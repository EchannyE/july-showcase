// backend/routes/upload.js - Full OCR upload route with CRUD operations for AI Financial Assistant

import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import authMiddleware from '../middleware/authMiddleware.js';
import { uploadReceipt, getAllTransactions, getTransactionById, deleteTransaction, updateTransaction } from '../controllers/uploadController.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Upload, OCR, parse and save transaction
router.post('/upload-receipt', authMiddleware, upload.single('receipt'), uploadReceipt);

// Fetch all transactions for the logged-in user
router.get('/transactions', authMiddleware, getAllTransactions);

// Fetch a specific transaction by ID for the logged-in user
router.get('/transactions/:id', authMiddleware, getTransactionById);

// Delete a transaction by ID for the logged-in user
router.delete('/transactions/:id', authMiddleware, deleteTransaction);

// Update a transaction by ID for the logged-in user
router.put('/transactions/:id', authMiddleware, updateTransaction);

export default router;