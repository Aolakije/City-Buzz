import { useEffect } from 'react';
import useAuthStore from '../store/authStore';

export const useAuth = () => {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    error,
    login,
    register,
    logout,
    getCurrentUser,
    clearError
  } = useAuthStore();

  // Check authentication on mount
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      getCurrentUser().catch(() => {
        // User not authenticated, do nothing
      });
    }
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };
};