import { create } from 'zustand';
import authService from '../services/auth.service';

// Global flags to prevent multiple initializations
let isInitializing = false;
let hasInitialized = false;

const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  hasCheckedAuth: false,
  error: null,

  // Initialize - check if user is logged in
  initialize: async () => {
    // Prevent multiple simultaneous calls
    if (isInitializing || hasInitialized) {
      return;
    }

    isInitializing = true;
    set({ isLoading: true, error: null });

    try {
      const res = await authService.getCurrentUser();
      
      // Extract user from various possible response structures
      const user = res.data?.user || res.user || res.data || null;
      
      set({
        user,
        isAuthenticated: !!user,
        isLoading: false,
        hasCheckedAuth: true
      });
      
      hasInitialized = true;
    } catch (error) {
      // User not authenticated - this is normal, not an error
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        hasCheckedAuth: true,
        error: null // Don't set error for unauthenticated state
      });
      
      hasInitialized = true;
    } finally {
      isInitializing = false;
    }
  },

  // Register user
  register: async (userData) => {
    set({ isLoading: true, error: null });
    
    try {
      const res = await authService.register(userData);
      set({ isLoading: false });
      return res;
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
      throw error;
    }
  },

  // Login user
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    
    try {
      const res = await authService.login(credentials);
      
      // Extract user from response
      const user = res.data?.user || res.user || res.data || null;
      
      if (!user) {
        throw new Error('User object missing from login response.');
      }

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        hasCheckedAuth: true
      });
      
      return res;
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false, 
        hasCheckedAuth: true 
      });
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    set({ isLoading: true, error: null });
    
    try {
      await authService.logout();
      
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        hasCheckedAuth: true
      });
      
      // Reset initialization flags so user can log in again
      hasInitialized = false;
      isInitializing = false;
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
      throw error;
    }
  },

  // Clear error
  clearError: () => set({ error: null })
}));

export default useAuthStore;