import { useState } from 'react';
import { useRouter } from 'next/router';
import { register } from '../lib/auth';

export default function RegisterPage() {
    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const router = useRouter();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(form);
            router.push('/login');
        } catch {
            alert('Registration failed');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '300px', margin: 'auto' }}>
            <h2>Register</h2>
            <input name="username" placeholder="Username" onChange={handleChange} required />
            <br />
            <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
            <br />
            <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
            <br />
            <button type="submit">Register</button>
        </form>
    );
}