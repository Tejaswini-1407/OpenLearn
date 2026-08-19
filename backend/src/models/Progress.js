import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  lecture: { type: mongoose.Schema.Types.ObjectId, ref: 'Lecture', required: true },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date, default: null },
}, { timestamps: true });

progressSchema.index({ student: 1, course: 1, lecture: 1 }, { unique: true });
export default mongoose.model('Progress', progressSchema);
