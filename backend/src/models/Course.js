import mongoose from 'mongoose';
const courseSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Course title is required.'], trim: true },
  description: { type: String, required: [true, 'Course description is required.'], trim: true },
  thumbnail: { type: String, trim: true, default: '' },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });
export default mongoose.model('Course', courseSchema);