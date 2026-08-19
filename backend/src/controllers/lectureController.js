import Course from '../models/Course.js';
import Module from '../models/Module.js';
import Lecture from '../models/Lecture.js';
import Progress from '../models/Progress.js';
import { invalidId, isValidId } from '../utils/validation.js';

const ownedModule = async (id, user, res) => { if (!isValidId(id)) { invalidId(res, 'module'); return null; } const module = await Module.findById(id); if (!module) { res.status(404).json({ message: 'Module not found.' }); return null; } const course = await Course.findById(module.course); if (!course || course.faculty.toString() !== user.toString()) { res.status(403).json({ message: 'You can only manage your own course lectures.' }); return null; } return module; };
const ownedLecture = async (id, user, res) => { if (!isValidId(id)) { invalidId(res, 'lecture'); return null; } const lecture = await Lecture.findById(id); if (!lecture) { res.status(404).json({ message: 'Lecture not found.' }); return null; } return (await ownedModule(lecture.module, user, res)) ? lecture : null; };
const data = (body) => ({ title: body.title, description: body.description || '', videoUrl: body.videoUrl || '', notes: body.notes || '', duration: body.duration || '', order: Number(body.order) || 0 });
export const createLecture = async (req, res, next) => { try { const module = await ownedModule(req.params.moduleId, req.user._id, res); if (!module) return; if (!req.body.title) return res.status(400).json({ message: 'Lecture title is required.' }); const lecture = await Lecture.create({ ...data(req.body), module: module._id }); res.status(201).json({ lecture }); } catch (error) { next(error); } };
export const updateLecture = async (req, res, next) => { try { const lecture = await ownedLecture(req.params.id, req.user._id, res); if (!lecture) return; if (!req.body.title) return res.status(400).json({ message: 'Lecture title is required.' }); Object.assign(lecture, data(req.body)); await lecture.save(); res.json({ lecture }); } catch (error) { next(error); } };
export const deleteLecture = async (req, res, next) => { try { const lecture = await ownedLecture(req.params.id, req.user._id, res); if (!lecture) return; await Progress.deleteMany({ lecture: lecture._id }); await lecture.deleteOne(); res.json({ message: 'Lecture deleted.' }); } catch (error) { next(error); } };
