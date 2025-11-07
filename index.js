import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './backend/src/routes/auth.js';
import expenseRoutes from './backend/src/routes/expenses.js';

dotenv.config();

const app = express( );

app.use(cors({ origin: 'http://localhost:27017', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use('/auth', authRoutes);
app.use('/expenses', expenseRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Backend running on port ${process.env.PORT}`);
});