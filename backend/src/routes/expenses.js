import express from 'express';
import { getExpenses, createExpense, getExpense, updateExpense, deleteExpense } from '../controllers/expenses.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, getExpenses);
router.post('/', authMiddleware, createExpense);
router.get('/:id', authMiddleware, getExpense);
router.patch('/:id', authMiddleware, updateExpense);
router.delete('/:id', authMiddleware, deleteExpense);

export default router;