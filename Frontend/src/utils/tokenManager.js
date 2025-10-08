import { STORAGE_KEYS } from './constants';

/**
 * Token management utilities
 */

// Decode JWT token to get expiration time
export const decodeToken = (token) => {
  try {
    if (!token || typeof token !== 'string') return null;
    
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const base64Url = parts[1];
    if (!base64Url) return null;
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Check if token is expired
export const isTokenExpired = (token) => {
  if (!token || typeof token !== 'string') return true;
  
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

// Get token expiration time in milliseconds
export const getTokenExpirationTime = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return null;
  
  return decoded.exp * 1000; // Convert to milliseconds
};

// Check if token expires within a certain time (in minutes)
export const isTokenExpiringSoon = (token, minutesThreshold = 5) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  
  const currentTime = Date.now() / 1000;
  const thresholdTime = currentTime + (minutesThreshold * 60);
  
  return decoded.exp < thresholdTime;
};

// Get stored token
export const getStoredToken = () => {
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
};

// Set token with expiration check
export const setToken = (token) => {
  if (!token) return false;
  
  if (isTokenExpired(token)) {
    console.warn('Attempting to store expired token');
    return false;
  }
  
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  return true;
};

// Remove token
export const removeToken = () => {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER_DATA);
};

// Setup automatic token expiration check
export const setupTokenExpirationCheck = (dispatch, logoutAction) => {
  const checkTokenExpiration = () => {
    const token = getStoredToken();
    
    if (token && isTokenExpired(token)) {
      console.log('Token expired, logging out user');
      dispatch(logoutAction());
      return;
    }
    
    // Check again in 1 minute
    setTimeout(checkTokenExpiration, 60000);
  };
  
  // Start checking
  checkTokenExpiration();
};

// Setup token refresh timer (if backend supports refresh)
export const setupTokenRefresh = (dispatch, refreshTokenAction) => {
  const scheduleRefresh = () => {
    const token = getStoredToken();
    
    if (!token) return;
    
    const expirationTime = getTokenExpirationTime(token);
    if (!expirationTime) return;
    
    // Refresh 5 minutes before expiration
    const refreshTime = expirationTime - Date.now() - (5 * 60 * 1000);
    
    if (refreshTime > 0) {
      setTimeout(() => {
        console.log('Refreshing token...');
        dispatch(refreshTokenAction());
        scheduleRefresh(); // Schedule next refresh
      }, refreshTime);
    }
  };
  
  scheduleRefresh();
};

// Validate token format
export const isValidTokenFormat = (token) => {
  if (!token || typeof token !== 'string') return false;
  
  // JWT tokens have 3 parts separated by dots
  const parts = token.split('.');
  return parts.length === 3;
};

// Get user info from token
export const getUserFromToken = (token) => {
  const decoded = decodeToken(token);
  if (!decoded) return null;
  
  return {
    id: decoded.sub || decoded.userId || decoded.id,
    email: decoded.email,
    role: decoded.role,
    name: decoded.name,
    exp: decoded.exp,
    iat: decoded.iat,
  };
};