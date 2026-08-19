import mongoose from 'mongoose';
export const isValidId = (id) => mongoose.isValidObjectId(id);
export const invalidId = (res, label = 'Resource') => res.status(400).json({ message: `Invalid ${label.toLowerCase()} ID.` });