import { baseApi } from './baseApi';
import { loginSuccess, loginFailure, logout } from '../slices/authSlice';

// Auth API endpoints
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Login endpoint
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(credentials, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          
          // Dispatch login success with token and user data
          dispatch(loginSuccess({
            token: data.token,
            user: data.user,
          }));
          
        } catch (error) {
          // Dispatch login failure with error message
          const errorMessage = error.error?.data?.message || 
                              error.error?.message || 
                              'Login failed. Please try again.';
          dispatch(loginFailure(errorMessage));
        }
      },
      invalidatesTags: ['Auth'],
    }),

    // Logout endpoint
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          // Even if logout fails on server, clear local state
          console.warn('Logout request failed:', error);
        } finally {
          // Always clear local auth state
          dispatch(logout());
        }
      },
      invalidatesTags: ['Auth'],
    }),

    // Get current user profile
    getProfile: builder.query({
      query: () => '/auth/profile',
      providesTags: ['Auth'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          
          // Update user data in auth slice
          dispatch(loginSuccess({
            token: localStorage.getItem('clinic_auth_token'), // Keep existing token
            user: data.user,
          }));
          
        } catch (error) {
          // If profile fetch fails with 401, user is not authenticated
          if (error.error?.status === 401) {
            dispatch(logout());
          }
        }
      },
    }),

    // Update user profile
    updateProfile: builder.mutation({
      query: (profileData) => ({
        url: '/auth/profile',
        method: 'PUT',
        body: profileData,
      }),
      async onQueryStarted(profileData, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          
          // Update user data in auth slice
          dispatch(loginSuccess({
            token: localStorage.getItem('clinic_auth_token'), // Keep existing token
            user: data.user,
          }));
          
        } catch (error) {
          console.error('Profile update failed:', error);
        }
      },
      invalidatesTags: ['Auth'],
    }),

    // Change password
    changePassword: builder.mutation({
      query: (passwordData) => ({
        url: '/auth/change-password',
        method: 'PUT',
        body: passwordData,
      }),
      invalidatesTags: ['Auth'],
    }),

    // Refresh token (if backend supports it)
    refreshToken: builder.mutation({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          
          // Update token in auth slice
          dispatch(loginSuccess({
            token: data.token,
            user: data.user,
          }));
          
        } catch (error) {
          // If refresh fails, logout user
          dispatch(logout());
        }
      },
      invalidatesTags: ['Auth'],
    }),

    // Verify token validity
    verifyToken: builder.query({
      query: () => '/auth/verify',
      providesTags: ['Auth'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Token is valid, no action needed
        } catch (error) {
          // Token is invalid, logout user
          if (error.error?.status === 401) {
            dispatch(logout());
          }
        }
      },
    }),
  }),
});

// Export hooks for components to use
export const {
  useLoginMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useRefreshTokenMutation,
  useVerifyTokenQuery,
} = authApi;

// Export endpoints for direct access if needed
export const {
  login,
  logout: logoutEndpoint,
  getProfile,
  updateProfile,
  changePassword,
  refreshToken,
  verifyToken,
} = authApi.endpoints;