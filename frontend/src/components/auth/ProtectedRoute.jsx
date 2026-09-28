import { Navigate } from 'react-router-dom';
import { useUserStore } from '../../store/useUserStore';
import Login from '../../pages/Login';

export default function ProtectedRoute({ children, role }) {
  const isAuthenticated = useUserStore((s) => s.isAuthenticated());
  const isAdmin = useUserStore((s) => s.isAdmin());
  const isSuperAdmin = useUserStore((s) => s.isSuperAdmin());

  if (!isAuthenticated) {
    return <Login />;
  }

  if (role === 'admin' && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (role === 'superadmin' && !isSuperAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
