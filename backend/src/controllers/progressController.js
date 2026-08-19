import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import Lecture from '../models/Lecture.js';
import Module from '../models/Module.js';
import Progress from '../models/Progress.js';
import { invalidId, isValidId } from '../utils/validation.js';

const checkAccess = async (courseId, lectureId, userId, res) => {
  if (!isValidId(courseId) || (lectureId && !isValidId(lectureId))) { invalidId(res, 'course or lecture'); return null; }
  const enrolled = await Enrollment.exists({ student: userId, course: courseId });
  if (!enrolled) { res.status(403).json({ message: 'Enroll in this course before viewing or updating progress.' }); return null; }
  if (!lectureId) return true;
  const lecture = await Lecture.findById(lectureId);
  if (!lecture) { res.status(404).json({ message: 'Lecture not found.' }); return null; }
  const module = await Module.findById(lecture.module);
  if (!module || module.course.toString() !== courseId) { res.status(400).json({ message: 'This lecture does not belong to the specified course.' }); return null; }
  return lecture;
};

export const setCompletion = async (req, res, next) => {
  try {
    const lecture = await checkAccess(req.params.courseId, req.params.lectureId, req.user._id, res); if (!lecture) return;
    if (typeof req.body.completed !== 'boolean') return res.status(400).json({ message: 'completed must be a boolean value.' });
    const completed = req.body.completed;
    const progress = await Progress.findOneAndUpdate({ student: req.user._id, course: req.params.courseId, lecture: lecture._id }, { completed, completedAt: completed ? new Date() : null }, { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true });
    res.json({ lectureId: lecture._id, completed: progress.completed, completedAt: progress.completedAt });
  } catch (error) { next(error); }
};

export const getCourseProgress = async (req, res, next) => {
  try {
    if (!isValidId(req.params.courseId)) return invalidId(res, 'course');
    const course = await Course.exists({ _id: req.params.courseId }); if (!course) return res.status(404).json({ message: 'Course not found.' });
    if (!await checkAccess(req.params.courseId, null, req.user._id, res)) return;
    const modules = await Module.find({ course: req.params.courseId }).select('_id');
    const lectures = modules.length ? await Lecture.find({ module: { $in: modules.map((item) => item._id) } }).sort({ order: 1 }).select('title module') : [];
    const records = await Progress.find({ student: req.user._id, course: req.params.courseId, completed: true }).select('lecture completed completedAt');
    const completedIds = new Set(records.map((item) => item.lecture.toString())); const totalLectures = lectures.length; const completedLectures = lectures.filter((item) => completedIds.has(item._id.toString())).length;
    res.json({ courseId: req.params.courseId, totalLectures, completedLectures, progressPercentage: totalLectures ? Math.round((completedLectures / totalLectures) * 100) : 0, lectures: lectures.map((item) => ({ lectureId: item._id, title: item.title, completed: completedIds.has(item._id.toString()) })) });
  } catch (error) { next(error); }
};
