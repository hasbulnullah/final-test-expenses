import { useState } from 'react';
import { useRouter } from 'next/router';
import { login } from '../lib/auth';

export default function LoginPage() {
    const [form, setForm] = useState({ email: '', password: '' });
    const router = useRouter();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(form);
            router.push('/app');
        } catch {
            alert('Login failed');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '300px', margin: 'auto' }}>
            <h2>Login</h2>
            <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
            <br />
            <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
            <br />
            <button type="submit">Login</button>
        </form>
    );
}