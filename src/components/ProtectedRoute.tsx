import { Navigate } from 'react-router-dom';
import { AuthService } from '@/services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

export const ProtectedRoute = ({ children, requiredRoles = [] }: ProtectedRouteProps) => {
  const user = AuthService.getStoredUser();

  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If specific roles are required, check if user has one of them
  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    // User doesn't have required role, redirect to dashboard
    return <Navigate to="/dashboard/overview" replace />;
  }

  // User is authenticated and has required role
  return <>{children}</>;
};

export default ProtectedRoute;
