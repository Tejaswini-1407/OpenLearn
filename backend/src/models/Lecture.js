import mongoose from 'mongoose';
const lectureSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Lecture title is required.'], trim: true },
  description: { type: String, trim: true, default: '' },
  videoUrl: { type: String, trim: true, default: '' },
  notes: { type: String, trim: true, default: '' },
  duration: { type: String, trim: true, default: '' },
  module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });
lectureSchema.index({ module: 1, order: 1 });
export default mongoose.model('Lecture', lectureSchema);