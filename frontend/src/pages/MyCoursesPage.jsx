import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getEnrolledCourses, getCourseProgress, unenrollCourse } from '../services/courseService.js';
import { useAuth } from '../context/AuthContext.jsx';

function EnrollmentCard({ course, onLeave }) {
  const progress = course.progress;
  return <article className="course-card">
    {course.thumbnail ? <img src={course.thumbnail} alt="" /> : <div className="course-placeholder">OL</div>}
    <div className="course-card-body">
      <p className="card-meta">{course.faculty?.name || 'OpenLearn Faculty'}</p>
      <h2>{course.title}</h2>
      <p>{course.description}</p>
      {progress && <div className="course-progress">
        <div className="progress-header"><strong>Progress</strong><span>{progress.progressPercentage}%</span></div>
        <div className="progress-track"><span style={{ width: `${progress.progressPercentage}%` }} /></div>
        <small>{progress.completedLectures} of {progress.totalLectures} lectures completed</small>
      </div>}
      <small>Enrolled {new Date(course.enrolledAt).toLocaleDateString()}</small>
      <div className="card-actions"><Link className="button button-primary" to={`/courses/${course._id}`}>Continue Learning</Link><button className="link-button" onClick={() => onLeave(course._id)}>Leave course</button></div>
    </div>
  </article>;
}

export default function MyCoursesPage() {
  const { token } = useAuth(); const [courses, setCourses] = useState([]); const [error, setError] = useState(''); const [loading, setLoading] = useState(true); const [notice, setNotice] = useState('');
  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getEnrolledCourses(token);
      const withProgress = await Promise.all(data.courses.map(async (course) => {
        try {
          return { ...course, progress: await getCourseProgress(course._id, token) };
        } catch {
          return course;
        }
      }));
      setCourses(withProgress);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(load, [token]);
  const leave = async (courseId) => { if (!window.confirm('Leave this course? You can enroll again later.')) return; try { await unenrollCourse(courseId, token); setCourses((items) => items.filter((course) => course._id !== courseId)); setNotice('You have left the course.'); } catch (err) { setError(err.message); } };
  if (loading) return <main className="loading-screen">Loading your courses…</main>;
  return <main className="content-page"><header className="page-header"><div><p className="eyebrow">MY LEARNING</p><h1>My courses</h1></div><Link className="button button-outline" to="/courses">Browse courses</Link></header>{error && <p className="error-message">{error}</p>}{notice && <p className="success-message">{notice}</p>}{courses.length ? <div className="course-grid">{courses.map((course) => <EnrollmentCard course={course} onLeave={leave} key={course._id} />)}</div> : <section className="empty-state"><h2>No enrolled courses yet</h2><p>Browse the catalog and enroll in a course to begin learning.</p><Link className="button button-primary" to="/courses">Browse Courses</Link></section>}</main>;
}
