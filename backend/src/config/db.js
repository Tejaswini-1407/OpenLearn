import mongoose from 'mongoose';
const connectDatabase = async () => {
  if (!process.env.MONGODB_URI) { console.error('MongoDB connection error: MONGODB_URI is not configured. Check backend/.env.'); process.exit(1); }
  try { const connection = await mongoose.connect(process.env.MONGODB_URI); console.log(`MongoDB connected: ${connection.connection.host}`); }
  catch (error) { console.error(`MongoDB connection error: ${error.message}`); process.exit(1); }
};
export default connectDatabase;