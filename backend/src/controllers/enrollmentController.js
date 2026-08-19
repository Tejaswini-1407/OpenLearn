import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import { invalidId, isValidId } from '../utils/validation.js';

export const enroll = async (req, res, next) => {
  try {
    if (!isValidId(req.params.courseId)) return invalidId(res, 'course');
    const course = await Course.findById(req.params.courseId).populate('faculty', 'name email');
    if (!course) return res.status(404).json({ message: 'Course not found.' });
    const existing = await Enrollment.findOne({ student: req.user._id, course: course._id });
    if (existing) return res.status(409).json({ message: 'You are already enrolled in this course.' });
    const enrollment = await Enrollment.create({ student: req.user._id, course: course._id });
    res.status(201).json({ message: 'Enrollment successful.', enrollment: { id: enrollment._id, enrolledAt: enrollment.enrolledAt, course } });
  } catch (error) { next(error); }
};

export const getMyCourses = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id }).populate({ path: 'course', populate: { path: 'faculty', select: 'name email' } }).sort({ enrolledAt: -1 });
    const courses = enrollments.filter((item) => item.course).map((item) => ({ ...item.course.toObject(), enrolledAt: item.enrolledAt, enrollmentId: item._id }));
    res.json({ courses });
  } catch (error) { next(error); }
};

export const getStatus = async (req, res, next) => {
  try {
    if (!isValidId(req.params.courseId)) return invalidId(res, 'course');
    const enrollment = await Enrollment.findOne({ student: req.user._id, course: req.params.courseId });
    res.json({ enrolled: Boolean(enrollment), enrolledAt: enrollment?.enrolledAt || null });
  } catch (error) { next(error); }
};

export const unenroll = async (req, res, next) => {
  try {
    if (!isValidId(req.params.courseId)) return invalidId(res, 'course');
    const enrollment = await Enrollment.findOneAndDelete({ student: req.user._id, course: req.params.courseId });
    if (!enrollment) return res.status(404).json({ message: 'You are not enrolled in this course.' });
    res.json({ message: 'You have left this course.' });
  } catch (error) { next(error); }
};
