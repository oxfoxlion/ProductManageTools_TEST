import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function RequireAuth() {
  const { user, ready } = useAuth();
  const loc = useLocation();

  if (!ready) return null; // or a spinner
  if (!user) {
    return <Navigate to="/login" replace state={{ from: loc }} />;
  }
  return <Outlet />;
}
