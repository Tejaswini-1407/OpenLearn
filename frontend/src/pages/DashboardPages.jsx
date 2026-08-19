import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { getCourses, getEnrolledCourses, getMyCourses } from '../services/courseService.js';
import { CourseCard } from './CoursePages.jsx';

function DashboardPage({ role }) {
  const { user, token, logout } = useAuth(); const [courses, setCourses] = useState([]); const [enrolled, setEnrolled] = useState([]); const [error, setError] = useState(''); const faculty = role === 'Faculty';
  useEffect(() => {
    const load = async () => { try { if (faculty) setCourses((await getMyCourses(token)).courses); else { const [catalog, myCourses] = await Promise.all([getCourses(token), getEnrolledCourses(token)]); setCourses(catalog.courses); setEnrolled(myCourses.courses); } } catch (err) { setError(err.message); } };
    load();
  }, [token, faculty]);
  const shownCourses = faculty ? courses : enrolled.slice(0, 3);
  return <main className="dashboard-page"><nav className="site-nav dashboard-nav"><Link className="brand" to="/"><span className="brand-mark">OL</span><span>OpenLearn</span></Link><div className="nav-actions">{!faculty && <Link className="text-link" to="/my-courses">My Courses</Link>}<button className="button button-outline" onClick={logout}>Log out</button></div></nav><section className="dashboard-content"><p className="eyebrow">{role.toUpperCase()} DASHBOARD</p><h1>Welcome back, {user.name}.</h1><p className="dashboard-copy">{faculty ? 'Create and organize learning content for your students.' : 'Keep your learning organized and pick up where you left off.'}</p><article className="profile-card"><div className="avatar">{user.name.charAt(0).toUpperCase()}</div><div><p className="profile-label">SIGNED-IN ACCOUNT</p><h2>{user.name}</h2><p>{user.email}</p></div><span className="role-badge">{role}</span></article>{!faculty && <section className="stats-row"><article><strong>{enrolled.length}</strong><span>Enrolled courses</span></article><article><strong>{courses.length}</strong><span>Available courses</span></article></section>}<section className="dashboard-courses"><div className="section-title"><div><p className="eyebrow">{faculty ? 'MY COURSES' : 'MY COURSES'}</p><h2>{faculty ? 'Your course library' : 'Continue learning'}</h2></div>{faculty ? <Link className="button button-primary" to="/faculty/courses/new">Create course</Link> : <div className="nav-actions"><Link className="button button-outline" to="/courses">Browse Courses</Link><Link className="button button-primary" to="/my-courses">My Courses</Link></div>}</div>{error ? <p className="error-message">{error}</p> : shownCourses.length ? <div className="course-grid">{shownCourses.map((course) => <CourseCard key={course._id} course={course} manage={faculty} />)}</div> : <p className="empty-state">{faculty ? 'You have not created a course yet.' : 'You have not enrolled in a course yet.'}</p>}</section></section></main>;
}
export const StudentDashboard = () => <DashboardPage role="Student" />;
export const FacultyDashboard = () => <DashboardPage role="Faculty" />;
