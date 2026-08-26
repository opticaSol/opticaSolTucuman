import { Navigate, useLocation } from 'react-router-dom';
import { useUserStore } from '../../store/useUserStore';

export default function ProtectedRoute({ children, role }) {
  const location = useLocation();
  const isAuthenticated = useUserStore((s) => s.isAuthenticated());
  const user = useUserStore((s) => s.user);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (role && user?.rol !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}
