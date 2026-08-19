import mongoose from 'mongoose';
const moduleSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Module title is required.'], trim: true },
  description: { type: String, trim: true, default: '' },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });
moduleSchema.index({ course: 1, order: 1 });
export default mongoose.model('Module', moduleSchema);