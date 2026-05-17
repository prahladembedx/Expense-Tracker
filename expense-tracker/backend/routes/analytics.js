const express = require('express');
const Expense = require('../models/Expense');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

// @route GET /api/analytics/summary
router.get('/summary', async (req, res) => {
  try {
    const { month, year } = req.query;
    const currentDate = new Date();
    const targetMonth = month !== undefined ? parseInt(month) : currentDate.getMonth();
    const targetYear = year !== undefined ? parseInt(year) : currentDate.getFullYear();

    const startDate = new Date(targetYear, targetMonth, 1);
    const endDate = new Date(targetYear, targetMonth + 1, 0);

    const summary = await Expense.aggregate([
      { $match: { user: req.user.id, date: { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    const result = { income: 0, expense: 0, incomeCount: 0, expenseCount: 0 };
    summary.forEach(s => {
      if (s._id === 'income') { result.income = s.total; result.incomeCount = s.count; }
      if (s._id === 'expense') { result.expense = s.total; result.expenseCount = s.count; }
    });
    result.balance = result.income - result.expense;
    result.savingsRate = result.income > 0 ? Math.round(((result.income - result.expense) / result.income) * 100) : 0;

    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route GET /api/analytics/by-category
router.get('/by-category', async (req, res) => {
  try {
    const { month, year, type = 'expense' } = req.query;
    const currentDate = new Date();
    const targetMonth = month !== undefined ? parseInt(month) : currentDate.getMonth();
    const targetYear = year !== undefined ? parseInt(year) : currentDate.getFullYear();

    const startDate = new Date(targetYear, targetMonth, 1);
    const endDate = new Date(targetYear, targetMonth + 1, 0);

    const data = await Expense.aggregate([
      { $match: { user: req.user.id, type, date: { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route GET /api/analytics/trend
router.get('/trend', async (req, res) => {
  try {
    const { months = 6 } = req.query;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - parseInt(months));

    const data = await Expense.aggregate([
      { $match: { user: req.user.id, date: { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type'
          },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route GET /api/analytics/daily
router.get('/daily', async (req, res) => {
  try {
    const { month, year } = req.query;
    const currentDate = new Date();
    const targetMonth = month !== undefined ? parseInt(month) : currentDate.getMonth();
    const targetYear = year !== undefined ? parseInt(year) : currentDate.getFullYear();

    const startDate = new Date(targetYear, targetMonth, 1);
    const endDate = new Date(targetYear, targetMonth + 1, 0);

    const data = await Expense.aggregate([
      { $match: { user: req.user.id, type: 'expense', date: { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: { $dayOfMonth: '$date' },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route GET /api/analytics/top-expenses
router.get('/top-expenses', async (req, res) => {
  try {
    const { limit = 5, month, year } = req.query;
    const currentDate = new Date();
    const targetMonth = month !== undefined ? parseInt(month) : currentDate.getMonth();
    const targetYear = year !== undefined ? parseInt(year) : currentDate.getFullYear();

    const startDate = new Date(targetYear, targetMonth, 1);
    const endDate = new Date(targetYear, targetMonth + 1, 0);

    const data = await Expense.find({
      user: req.user.id,
      type: 'expense',
      date: { $gte: startDate, $lte: endDate }
    }).sort({ amount: -1 }).limit(parseInt(limit));

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
