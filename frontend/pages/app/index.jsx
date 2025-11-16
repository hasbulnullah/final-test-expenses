import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getMe, logout } from '../../lib/auth';
import api from '../../lib/api';

export default function App() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingExpense, setEditingExpense] = useState(null); 
    const [formData, setFormData] = useState({ title: '', notes: '', amount: '', category: '', date: '' });

    useEffect(() => {
        getMe()
            .then((data) => {
                setUser(data);
                fetchExpenses();
            })
            .catch(() => router.push('/login'));
    }, []);

    const fetchExpenses = async () => {
        try {
            const res = await api.get('/expenses');
            setExpenses(res.data);
        } catch {
            alert('Failed to fetch expenses');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddExpense = async (e) => {
        e.preventDefault();
        try {
            await api.post('/expenses', { ...formData, amount: parseFloat(formData.amount), date: formData.date || new Date() });
            setFormData({ title: '', notes: '', amount: '', category: '', date: '' });
            fetchExpenses();
        } catch {
            alert('Failed to add expense');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            await api.delete(`/expenses/${id}`);
            fetchExpenses();
        } catch {
            alert('Failed to delete');
        }
    };

    const handleEdit = (expense) => {
        setEditingExpense(expense);
        setFormData({
            title: expense.title,
            notes: expense.notes,
            amount: expense.amount,
            category: expense.category,
            date: expense.date.slice(0,10), // format for input[type=date]
        });
    };

    const handleUpdateExpense = async (e) => {
        e.preventDefault();
        try {
            await api.patch(`/expenses/${editingExpense._id}`, {
                ...formData,
                amount: parseFloat(formData.amount),
                date: formData.date,
            });
            setEditingExpense(null);
            setFormData({ title: '', notes: '', amount: '', category: '', date: '' });
            fetchExpenses();
        } catch {
            alert('Failed to update expense');
        }
    };

    if (!user || loading) return <div>Loading...</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '20px auto', fontFamily: 'Arial, sans-serif' }}>
            <h1>Expenses Tracker</h1>
            <p>Welcome, {user.username}!</p>
            <button onClick={handleLogout}>Logout</button>

            {/* Expense List */}
            <h2>Your Expenses</h2>
            {expenses.length === 0 ? (
                <p>No expenses yet.</p>
            ) : (
                <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%', marginBottom: '20px' }}>
                    <thead>
                    <tr>
                        <th>Title</th>
                        <th>Notes</th>
                        <th>Amount</th>
                        <th>Category</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {expenses.map((exp) => (
                        <tr key={exp._id}>
                            <td>{exp.title}</td>
                            <td>{exp.notes}</td>
                            <td>${exp.amount.toFixed(2)}</td>
                            <td>{exp.category}</td>
                            <td>{new Date(exp.date).toLocaleDateString()}</td>
                            <td>
                                <button onClick={() => handleEdit(exp)}>Edit</button>
                                <button onClick={() => handleDelete(exp._id)} style={{ marginLeft: '8px' }}>Delete</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {/* Expense Form for Add / Edit */}
            <h2>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</h2>
            <form onSubmit={editingExpense ? handleUpdateExpense : handleAddExpense} style={{ display: 'flex', flexDirection: 'column', maxWidth: '400px' }}>
                <input
                    name="title"
                    placeholder="Title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    style={{ marginBottom: '8px' }}
                />
                <input
                    name="notes"
                    placeholder="Notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    style={{ marginBottom: '8px' }}
                />
                <input
                    name="amount"
                    type="number"
                    placeholder="Amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    style={{ marginBottom: '8px' }}
                />
                <input
                    name="category"
                    placeholder="Category"
                    value={formData.category}
                    onChange={handleInputChange}
                    style={{ marginBottom: '8px' }}
                />
                <input
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    style={{ marginBottom: '8px' }}
                />
                <button type="submit" style={{ marginTop: '8px' }}>
                    {editingExpense ? 'Update Expense' : 'Add Expense'}
                </button>
                {editingExpense && (
                    <button
                        type="button"
                        onClick={() => {
                            setEditingExpense(null);
                            setFormData({ title: '', notes: '', amount: '', category: '', date: '' });
                        }}
                        style={{ marginTop: '8px' }}
                    >
                        Cancel
                    </button>
                )}
            </form>
        </div>
    );
}
