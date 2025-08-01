import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

import receiptRoutes from './routes/receiptRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import uploadRoute from './routes/upload.js';
import userRoutes from './routes/user.js';
import transactionRoutes from './routes/transaction.js';
import authMiddleware from './middleware/authMiddleware.js';
import parseTransaction from './utils/parseTransaction.js';
import ocrRoutes from './routes/ocrRoutes.js';
import cookieParser from 'cookie-parser';
import authRoute from './routes/auth.js';
import profileRoute from './routes/profileRoute.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static('uploads'));
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Routes
app.use('/api/auth', authRoute);        // register, login, refresh, logout
app.use('/api/user', userRoutes);       // profile, update, delete
app.use('/api/ocr', ocrRoutes);        // OCR processing
app.use('/api/ocr/receipts', receiptRoutes);
app.use('/api/transaction', authMiddleware, transactionRoutes);
app.use('/api/upload', authMiddleware, uploadRoute); // file upload
app.use('/api/profile', authMiddleware, profileRoute); // user profile
app.use('/api/stats',  statsRoutes);  // spending statistics
// Parse transaction endpoint
app.use('/api/parse', authMiddleware, async (req, res) => {
  try {
    const text = req.body.text;
    if (!text) {
      return res.status(400).json({ message: 'No text provided for parsing' });
    }

    const transactionData = parseTransaction(text);
    if (!transactionData.merchant || !transactionData.amount || !transactionData.date) {
      return res.status(422).json({ message: 'Failed to parse transaction details', extractedText: text });
    }

    res.status(200).json({ message: 'Parsing successful', transactionData });
  } catch (error) {
    console.error('Parsing error:', error);
    res.status(500).json({ message: 'Parsing failed', error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});
