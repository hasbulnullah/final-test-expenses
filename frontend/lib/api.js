import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000', // Your backend server URL
    withCredentials: true, // Send cookies for refresh tokens
});

export default api;