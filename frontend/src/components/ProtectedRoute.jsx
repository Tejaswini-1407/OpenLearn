import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
function ProtectedRoute({ allowedRole }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="status-message">Checking your session...</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to={`/${user.role}/dashboard`} replace />;
  return <Outlet />;
}
export default ProtectedRoute;