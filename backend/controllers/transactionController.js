import Transaction from '../models/Transaction.js';

// ✅ Create a transaction
export const createTransaction = async (req, res, next) => {
  try {
    const { merchant, amount, date, category } = req.body;

    const transaction = new Transaction({
      user: req.user._id,
      merchant,
      amount,
      date,
      category,
    });

    const savedTransaction = await transaction.save();
    res.status(201).json(savedTransaction);
  } catch (err) {
    next(err);
  }
};

// ✅ Get all transactions for a user
export const getTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (err) {
    next(err);
  }
};

// ✅ Delete a transaction
export const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (err) {
    next(err);
  }
};
