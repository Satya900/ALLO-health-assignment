import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import {
  selectAuth,
  selectIsAuthenticated,
  selectCurrentUser,
  selectAuthToken,
  selectAuthLoading,
  selectAuthError,
  logout,
  clearError,
} from '../store/slices/authSlice';
import {
  useLoginMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useVerifyTokenQuery,
} from '../store/api/authApi';
import {
  isTokenExpired,
  setupTokenExpirationCheck,
  getStoredToken,
} from '../utils/tokenManager';

/**
 * Custom hook for authentication
 * Provides auth state and methods for login, logout, etc.
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  
  // Auth state from Redux
  const auth = useSelector(selectAuth);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectAuthToken);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  
  // RTK Query mutations and queries
  const [loginMutation, { isLoading: isLoggingIn }] = useLoginMutation();
  const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();
  
  // Auto-fetch profile if token exists but user data is missing
  const shouldFetchProfile = isAuthenticated && token && !user;
  const { 
    data: profileData, 
    isLoading: isLoadingProfile,
    error: profileError 
  } = useGetProfileQuery(undefined, {
    skip: !shouldFetchProfile,
  });
  
  // Verify token on mount if it exists
  const storedToken = getStoredToken();
  const shouldVerifyToken = storedToken && !isAuthenticated;
  const { 
    isLoading: isVerifyingToken,
    error: verifyError 
  } = useVerifyTokenQuery(undefined, {
    skip: !shouldVerifyToken,
  });
  
  // Setup automatic token expiration check
  useEffect(() => {
    if (isAuthenticated && token) {
      setupTokenExpirationCheck(dispatch, logout);
    }
  }, [isAuthenticated, token, dispatch]);
  
  // Check for expired token on mount
  useEffect(() => {
    const storedToken = getStoredToken();
    if (storedToken && isTokenExpired(storedToken)) {
      console.log('Stored token is expired, logging out');
      dispatch(logout());
    }
  }, [dispatch]);
  
  // Login function
  const login = async (credentials) => {
    try {
      const result = await loginMutation(credentials).unwrap();
      return { success: true, data: result };
    } catch (error) {
      const errorMessage = error.data?.message || error.message || 'Login failed';
      return { success: false, error: errorMessage };
    }
  };
  
  // Logout function
  const logoutUser = async () => {
    try {
      await logoutMutation().unwrap();
      return { success: true };
    } catch (error) {
      // Even if server logout fails, clear local state
      dispatch(logout());
      return { success: true };
    }
  };
  
  // Clear auth error
  const clearAuthError = () => {
    dispatch(clearError());
  };
  
  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role === role;
  };
  
  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    return roles.includes(user?.role);
  };
  
  // Check if user is admin
  const isAdmin = () => {
    return user?.role === 'admin';
  };
  
  // Check if user is front desk staff
  const isFrontDesk = () => {
    return user?.role === 'frontdesk';
  };
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return '';
    return user.name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };
  
  // Combined loading state
  const isAuthLoading = loading || 
                       isLoggingIn || 
                       isLoggingOut || 
                       isLoadingProfile || 
                       isVerifyingToken;
  
  // Combined error state
  const authError = error || profileError?.data?.message || verifyError?.data?.message;
  
  return {
    // State
    auth,
    isAuthenticated,
    user,
    token,
    loading: isAuthLoading,
    error: authError,
    
    // Actions
    login,
    logout: logoutUser,
    clearError: clearAuthError,
    
    // Utilities
    hasRole,
    hasAnyRole,
    isAdmin,
    isFrontDesk,
    getUserInitials,
    
    // Loading states
    isLoggingIn,
    isLoggingOut,
    isLoadingProfile,
    isVerifyingToken,
  };
};