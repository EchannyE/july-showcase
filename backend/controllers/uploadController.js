import fs from 'fs/promises';
import path from 'path';
import Tesseract from 'tesseract.js';
import Transaction from '../models/Transaction.js';
import parseTransaction from '../utils/parseTransaction.js';

// Upload, OCR, parse, and save transaction
export const uploadReceipt = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  const filePath = path.resolve(req.file.path);
  try {
    // OCR processing
    try {
    const { data: { text } } = await Tesseract.recognize(filePath, 'eng', {
        logger: m => console.log(m)
    });
    text = result.data.text;
      console.log(text);
    } catch (error) {
      await fs.unlink(filePath);
      console.error('OCR error:', error);
      return res.status(500).json({ message: 'OCR processing failed', error: error.message });
    }

    // Parse transaction data from OCR text
    const transactionData = parseTransaction(text);

    // Validate parsed data
    if (!transactionData.merchant || !transactionData.amount || !transactionData.date) {
      await fs.unlink(filePath);
      return res.status(422).json({ message: 'Failed to parse transaction details from receipt', extractedText: text });
    }

    // Save transaction
    const transaction = new Transaction({
      merchant: transactionData.merchant,
      amount: transactionData.amount,
      date: transactionData.date,
      user: req.user._id
    });
    await transaction.save();

    // Delete uploaded file asynchronously
    await fs.unlink(filePath);

    res.status(201).json({
      message: 'OCR, parsing, and saving completed successfully',
      extractedText: text,
      transaction
    });
  } catch (error) {
    // Attempt to clean up file if error occurs
    try { await fs.unlink(filePath); } catch {}
    console.error(error);
    res.status(500).json({ message: 'OCR processing failed', error: error.message });
  }
};

// Get all transactions for the logged-in user
export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ count: transactions.length, transactions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve transactions', error: error.message });
  }
};

// Get a specific transaction by ID for the logged-in user
export const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user._id });
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    res.json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve transaction', error: error.message });
  }
};

// Delete a transaction by ID for the logged-in user
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    res.json({ message: 'Transaction deleted successfully', transaction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete transaction', error: error.message });
  }
};

// Update a transaction by ID for the logged-in user
export const updateTransaction = async (req, res) => {
  try {
    const { merchant, amount, date } = req.body;
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { merchant, amount, date },
      { new: true }
    );
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    res.json({ message: 'Transaction updated successfully', transaction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update transaction', error: error.message });
  }
};