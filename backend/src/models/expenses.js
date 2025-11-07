import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    notes: String,
    amount: { type: Number, required: true },
    category: String,
    date: { type: Date, default: Date.now },
});

export default mongoose.model('Expense', expenseSchema);