import Expense from '../models/expenses.js';

export const getExpenses = async (req, res) => {
    const expenses = await Expense.find({ user: req.user.userId });
    res.json(expenses);
};

export const createExpense = async (req, res) => {
    const { title, notes, amount, category, date } = req.body;
    const expense = new Expense({ user: req.user.userId, title, notes, amount, category, date });
    await expense.save();
    res.status(201).json(expense);
};

export const getExpense = async (req, res) => {
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user.userId });
    if (!expense) return res.status(404).json({ message: 'Not found' });
    res.json(expense);
};

export const updateExpense = async (req, res) => {
    const expense = await Expense.findOneAndUpdate(
        { _id: req.params.id, user: req.user.userId },
        req.body,
        { new: true }
    );
    if (!expense) return res.status(404).json({ message: 'Not found' });
    res.json(expense);
};

export const deleteExpense = async (req, res) => {
    const result = await Expense.deleteOne({ _id: req.params.id, user: req.user.userId });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Not found' });
    res.status(204).end();
};