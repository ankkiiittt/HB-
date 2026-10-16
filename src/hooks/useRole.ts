import { useAuth } from '../auth/useAuth';
import type { UserRole } from '../types/auth';

export function useRole() {
  const { user } = useAuth();
  const role: UserRole = user?.role || 'user';
  const isAdmin = role === 'admin';
  const isUser = role === 'user';

  const hasRole = (allowedRoles: UserRole[]): boolean => {
    return allowedRoles.includes(role);
  };

  return {
    role,
    isAdmin,
    isUser,
    hasRole,
  };
}
