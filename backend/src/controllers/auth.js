import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from "../models/User.js";

export const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) return res.status(409).json({ message: 'User exists' });
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, passwordHash: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User registered' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
        const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
        user.refreshToken = refreshToken;
        await user.save();
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: false, sameSite: 'Strict' });
        res.json({ accessToken });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const refresh = async (req, res) => {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ message: 'No refresh token' });
    try {
        const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(payload.userId);
        if (!user || user.refreshToken !== token) return res.status(403).json({ message: 'Invalid refresh token' });
        const newAccessToken = jwt.sign({ userId: user._id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
        res.json({ accessToken: newAccessToken });
    } catch (err) {
        res.status(403).json({ message: 'Invalid token' });
    }
};

export const getMe = async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const user = await User.findById(userId).select('-passwordHash -refreshToken');
    res.json(user);
};

export const logout = async (req, res) => {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(400).json({ message: 'No token' });
    try {
        const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(payload.userId);
        if (user) {
            user.refreshToken = null;
            await user.save();
        }
        res.clearCookie('refreshToken');
        res.json({ message: 'Logged out' });
    } catch {
        res.status(400).json({ message: 'Invalid token' });
    }
};