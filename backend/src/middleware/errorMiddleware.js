export const notFound = (req, res) => res.status(404).json({ message: 'Route not found.' });

export const errorHandler = (error, req, res, next) => {
  console.error(error);
  if (error.name === 'ValidationError') return res.status(400).json({ message: Object.values(error.errors).map((item) => item.message).join(' ') });
  if (error.code === 11000) return res.status(409).json({ message: error.keyPattern?.email ? 'An account with this email already exists.' : 'Student is already enrolled in this course.' });
  return res.status(error.statusCode || 500).json({ message: error.message || 'Something went wrong.' });
};
