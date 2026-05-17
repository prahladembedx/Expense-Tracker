const express = require('express');
const Budget = require('../models/Budget');
const Expense = require('../models/Expense');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

// @route GET /api/budgets
router.get('/', async (req, res) => {
  try {
    const { month, year } = req.query;
    const currentDate = new Date();
    const targetMonth = month !== undefined ? parseInt(month) : currentDate.getMonth();
    const targetYear = year !== undefined ? parseInt(year) : currentDate.getFullYear();

    const budgets = await Budget.find({ user: req.user.id, month: targetMonth, year: targetYear });

    // Get actual spending per category for this month
    const startDate = new Date(targetYear, targetMonth, 1);
    const endDate = new Date(targetYear, targetMonth + 1, 0);

    const spending = await Expense.aggregate([
      {
        $match: {
          user: req.user.id,
          type: 'expense',
          date: { $gte: startDate, $lte: endDate }
        }
      },
      { $group: { _id: '$category', total: { $sum: '$amount' } } }
    ]);

    const spendingMap = {};
    spending.forEach(s => { spendingMap[s._id] = s.total; });

    const budgetsWithSpending = budgets.map(budget => ({
      ...budget.toObject(),
      spent: spendingMap[budget.category] || 0,
      remaining: budget.amount - (spendingMap[budget.category] || 0),
      percentage: Math.round(((spendingMap[budget.category] || 0) / budget.amount) * 100)
    }));

    res.json({ success: true, data: budgetsWithSpending });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route POST /api/budgets
router.post('/', async (req, res) => {
  try {
    const { category, amount, month, year, alertThreshold } = req.body;
    const budget = await Budget.findOneAndUpdate(
      { user: req.user.id, category, month, year },
      { amount, alertThreshold },
      { new: true, upsert: true, runValidators: true }
    );
    res.status(201).json({ success: true, data: budget });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// @route PUT /api/budgets/:id
router.put('/:id', async (req, res) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!budget) return res.status(404).json({ success: false, message: 'Budget not found' });
    res.json({ success: true, data: budget });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route DELETE /api/budgets/:id
router.delete('/:id', async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!budget) return res.status(404).json({ success: false, message: 'Budget not found' });
    res.json({ success: true, message: 'Budget deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
