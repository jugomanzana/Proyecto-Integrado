import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../viewmodels/useAuth';

export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export const RoleRoute = ({ requiredRole }: { requiredRole: string }) => {
  const { user } = useAuth();

  if (!user || user.role !== requiredRole) {
    return <Navigate to="/" replace />; // Or to a 'Forbidden' page
  }

  return <Outlet />;
};
