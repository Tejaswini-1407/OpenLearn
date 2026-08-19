import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { createCourse, enrollCourse, getCourse, getCourseProgress, getCourses, setLectureCompletion } from '../services/courseService.js';
import { useAuth } from '../context/AuthContext.jsx';

export function CourseCard({ course, manage = false }) {
  return <article className="course-card">
    {course.thumbnail ? <img src={course.thumbnail} alt="" /> : <div className="course-placeholder">OL</div>}
    <div className="course-card-body"><p className="card-meta">{course.faculty?.name || 'OpenLearn Faculty'}</p><h2>{course.title}</h2><p>{course.description}</p><small>{course.moduleCount || 0} modules · {course.lectureCount || 0} lectures</small><Link className="button button-primary" to={manage ? `/faculty/courses/${course._id}/manage` : `/courses/${course._id}`}>{manage ? 'Manage course' : 'View course'}</Link></div>
  </article>;
}

export function CoursesPage() {
  const { token } = useAuth(); const [courses, setCourses] = useState([]); const [error, setError] = useState('');
  useEffect(() => { getCourses(token).then((data) => setCourses(data.courses)).catch((err) => setError(err.message)); }, [token]);
  return <main className="content-page"><header className="page-header"><div><p className="eyebrow">COURSE CATALOG</p><h1>Available courses</h1></div><Link className="button button-outline" to="/student/dashboard">Dashboard</Link></header>{error ? <p className="error-message">{error}</p> : courses.length ? <div className="course-grid">{courses.map((course) => <CourseCard key={course._id} course={course} />)}</div> : <p className="empty-state">No courses are available yet.</p>}</main>;
}

export function CourseDetailPage() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const [course, setCourse] = useState();
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState('');
  const [enrolling, setEnrolling] = useState(false);
  const [notice, setNotice] = useState('');

  const loadCourse = async () => {
    try {
      const data = await getCourse(id, token);
      setCourse(data.course);
      if (user?.role === 'student' && data.course.enrolled) {
        const progressData = await getCourseProgress(id, token);
        setProgress(progressData);
      } else {
        setProgress(null);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadCourse();
  }, [id, token, user?.role]);

  if (error) return <main className="content-page"><p className="error-message">{error}</p></main>;
  if (!course) return <main className="loading-screen">Loading course…</main>;

  const enroll = async () => {
    setEnrolling(true);
    setError('');
    try {
      await enrollCourse(id, token);
      setNotice('Enrollment successful. You can now start learning.');
      await loadCourse();
    } catch (err) {
      setError(err.message);
    } finally {
      setEnrolling(false);
    }
  };

  const studentLocked = user.role === 'student' && !course.enrolled;
  const completedIds = new Set((progress?.lectures || []).filter((item) => item.completed).map((item) => item.lectureId.toString()));

  return <main className="content-page">
    <header className="course-hero">
      {course.thumbnail && <img src={course.thumbnail} alt="" />}
      <div>
        <p className="eyebrow">{course.faculty?.name}</p>
        <h1>{course.title}</h1>
        <p>{course.description}</p>
        {user.role === 'student' && (course.enrolled
          ? <div className="enrollment-actions">
              <span className="enrolled-badge">Enrolled</span>
              <Link className="button button-primary" to="/my-courses">My Courses</Link>
            </div>
          : <button className="button button-primary" onClick={enroll} disabled={enrolling}>{enrolling ? 'Enrolling…' : 'Enroll Now'}</button>)}
        {course.enrolled && progress && (
          <div className="course-progress">
            <div className="progress-header"><strong>Course progress</strong><span>{progress.completedLectures}/{progress.totalLectures} lectures · {progress.progressPercentage}%</span></div>
            <div className="progress-track" aria-label={`Course progress ${progress.progressPercentage}%`}><span style={{ width: `${progress.progressPercentage}%` }} /></div>
          </div>
        )}
      </div>
    </header>
    {notice && <p className="success-message">{notice}</p>}
    <section className="module-list">
      <h2>Course content</h2>
      {studentLocked ? <div className="empty-state">Enroll in this course to unlock its lectures.</div> :
        course.modules.length ? course.modules.map((module) => <details className="module-panel" key={module._id} open>
          <summary><span>{module.title}</span><small>{module.lectures.length} lectures</small></summary>
          {module.description && <p>{module.description}</p>}
          {module.lectures.map((lecture) => <Link className="lecture-row" key={lecture._id} to={`/courses/${id}/lectures/${lecture._id}`}>
            <span>{completedIds.has(lecture._id.toString()) ? '✓' : '▶'}</span>
            <span><strong>{lecture.title}</strong><small>{lecture.duration || 'Lecture'}</small></span>
            <b>{completedIds.has(lecture._id.toString()) ? 'Completed' : 'Watch →'}</b>
          </Link>)}
        </details>) : <p className="empty-state">No content yet.</p>}
    </section>
  </main>;
}

export function LecturePage() {
  const { id, lectureId } = useParams(); const { token, user } = useAuth(); const [course, setCourse] = useState(); const [progress, setProgress] = useState(); const [error, setError] = useState(''); const [saving, setSaving] = useState(false);
  useEffect(() => { getCourse(id, token).then((data) => setCourse(data.course)); }, [id, token]);
  useEffect(() => { if (user?.role === 'student') getCourseProgress(id, token).then(setProgress).catch((err) => setError(err.message)); }, [id, token, user]);
  if (!course) return <main className="loading-screen">Loading lecture…</main>;
  const list = course.modules.flatMap((module) => module.lectures); const index = list.findIndex((lecture) => lecture._id === lectureId); const lecture = list[index];
  if (!lecture) return <main className="content-page">Lecture not found.</main>;
  const embed = lecture.videoUrl?.includes('watch?v=') ? lecture.videoUrl.replace('watch?v=', 'embed/') : lecture.videoUrl?.includes('youtu.be/') ? lecture.videoUrl.replace('youtu.be/', 'youtube.com/embed/') : '';
  const completed = progress?.lectures?.find((item) => item.lectureId === lectureId)?.completed;
  const toggle = async () => { setSaving(true); try { await setLectureCompletion(id, lectureId, !completed, token); const data = await getCourseProgress(id, token); setProgress(data); } catch (err) { setError(err.message); } finally { setSaving(false); } };
  return <main className="content-page learning-page"><Link className="text-link" to={`/courses/${id}`}>← Back to course</Link><h1>{lecture.title}</h1>{embed ? <iframe className="video-frame" src={embed} title={lecture.title} allowFullScreen /> : lecture.videoUrl ? <video className="video-frame" controls src={lecture.videoUrl} /> : <div className="video-empty">No video URL yet.</div>}{user.role === 'student' && <button className={`button ${completed ? 'button-outline' : 'button-primary'}`} onClick={toggle} disabled={saving}>{saving ? 'Saving…' : completed ? 'Completed ✓ — Mark incomplete' : 'Mark as Complete'}</button>}{error && <p className="error-message">{error}</p>}<p className="lecture-duration">Duration: {lecture.duration || 'Not specified'}</p><h2>About this lecture</h2><p>{lecture.description || 'No description provided.'}</p>{lecture.notes && <section className="notes"><h2>Notes & resources</h2><p>{lecture.notes}</p></section>}<div className="lesson-nav">{list[index - 1] ? <Link to={`/courses/${id}/lectures/${list[index - 1]._id}`}>← Previous</Link> : <span />}{list[index + 1] ? <Link to={`/courses/${id}/lectures/${list[index + 1]._id}`}>Next →</Link> : <span />}</div></main>;
}

export function NewCoursePage() {
  const { token } = useAuth(); const navigate = useNavigate(); const [form, setForm] = useState({ title: '', description: '', thumbnail: '' }); const [error, setError] = useState(''); const [saving, setSaving] = useState(false);
  const submit = async (event) => { event.preventDefault(); setSaving(true); setError(''); try { const data = await createCourse(form, token); navigate(`/faculty/courses/${data.course._id}/manage`); } catch (err) { setError(err.message); } finally { setSaving(false); } };
  return <main className="content-page"><form className="editor-card" onSubmit={submit}><h1>Create a course</h1>{error && <p className="error-message">{error}</p>}<label>Course title<input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></label><label>Description<textarea required value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label><label>Thumbnail URL (optional)<input value={form.thumbnail} onChange={(event) => setForm({ ...form, thumbnail: event.target.value })} /></label><button className="button button-primary" disabled={saving}>{saving ? 'Creating…' : 'Create course'}</button></form></main>;
}
