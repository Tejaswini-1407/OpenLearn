import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import { FacultyRegisterPage, LoginPage, StudentRegisterPage } from '../pages/AuthPages.jsx';
import { FacultyDashboard, StudentDashboard } from '../pages/DashboardPages.jsx';
import { CourseDetailPage, CoursesPage, LecturePage, NewCoursePage } from '../pages/CoursePages.jsx';
import { ManageCoursePage } from '../pages/ManageCoursePage.jsx';
import MyCoursesPage from '../pages/MyCoursesPage.jsx';
import HomePage from '../pages/HomePage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
function AppRoutes() { return <Routes><Route path="/" element={<HomePage />} /><Route path="/login" element={<LoginPage />} /><Route path="/register/student" element={<StudentRegisterPage />} /><Route path="/register/faculty" element={<FacultyRegisterPage />} /><Route element={<ProtectedRoute />}><Route path="/courses" element={<CoursesPage />} /><Route path="/courses/:id" element={<CourseDetailPage />} /><Route path="/courses/:id/lectures/:lectureId" element={<LecturePage />} /></Route><Route element={<ProtectedRoute allowedRole="student" />}><Route path="/student/dashboard" element={<StudentDashboard />} /><Route path="/my-courses" element={<MyCoursesPage />} /></Route><Route element={<ProtectedRoute allowedRole="faculty" />}><Route path="/faculty/dashboard" element={<FacultyDashboard />} /><Route path="/faculty/courses/new" element={<NewCoursePage />} /><Route path="/faculty/courses/:id/manage" element={<ManageCoursePage />} /></Route><Route path="*" element={<NotFoundPage />} /></Routes>; }
export default AppRoutes;
