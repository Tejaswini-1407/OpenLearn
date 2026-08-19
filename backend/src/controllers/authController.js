import User from '../models/User.js';
import generateToken from '../services/tokenService.js';

const publicUser = (user) => ({ id: user._id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt });

const register = (role) => async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email, and password are required.' });
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) return res.status(409).json({ message: 'An account with this email already exists.' });
    const user = await User.create({ name, email, password, role });
    return res.status(201).json({ message: `${role} account created successfully.`, token: generateToken(user), user: publicUser(user) });
  } catch (error) { next(error); }
};

export const registerStudent = register('student');
export const registerFaculty = register('faculty');

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.comparePassword(password))) return res.status(401).json({ message: 'Invalid email or password.' });
    return res.status(200).json({ message: 'Login successful.', token: generateToken(user), user: publicUser(user) });
  } catch (error) { next(error); }
};

export const getCurrentUser = async (req, res) => res.status(200).json({ user: publicUser(req.user) });