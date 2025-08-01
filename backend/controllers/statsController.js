import Transaction from '../models/Transaction.js';

export const getMonthlySpending = async (req, res) => {
  try {
    const userId = req.user.id;

    // Aggregate total spending grouped by month
    const stats = await Transaction.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: { $substr: ['$date', 0, 7] }, // e.g., "2025-07"
          total: { $sum: '$amount' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    const formatted = stats.map(item => ({
      month: item._id,
      total: item.total
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load spending stats' });
  }
};
