import mongoose from 'mongoose';
import User from './User.js';
import Course from './Course.js';

const enrollmentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, validate: { validator: async (id) => (await User.findById(id).select('role'))?.role === 'student', message: 'Enrollment student must have the student role.' } },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, validate: { validator: async (id) => Boolean(await Course.exists({ _id: id })), message: 'Enrollment course must exist.' } },
  enrolledAt: { type: Date, default: Date.now },
}, { timestamps: true });

enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });
export default mongoose.model('Enrollment', enrollmentSchema);
