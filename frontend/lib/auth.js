import api from './api';

export async function login(credentials) {
    const response = await api.post('/auth/login', credentials);
    return response.data; // contains accessToken
}

export async function register(credentials) {
    const response = await api.post('/auth/register', credentials);
    return response.data;
}

export async function getMe() {
    const response = await api.get('/auth/me');
    return response.data; // current user info
}

export async function logout() {
    await api.post('/auth/logout');
}