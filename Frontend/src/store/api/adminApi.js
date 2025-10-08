import { baseApi } from './baseApi';
import {
  setAdminLoading,
  setAdminError,
  setUsers,
  addUser as addUserToStore,
  updateUser as updateUserInStore,
  removeUser,
  setUserPagination,
  setReportsLoading,
  setReportsError,
  setReportsData,
  setSystemSettingsLoading,
  setSystemSettingsError,
  setSystemSettingsData,
} from '../slices/adminSlice';

// Admin API endpoints
export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // User Management Endpoints
    
    // Get all users with filtering and pagination
    getUsers: builder.query({
      query: ({ 
        page = 1, 
        limit = 10, 
        role = '', 
        status = '', 
        search = '' 
      } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        
        if (role) params.append('role', role);
        if (status) params.append('status', status);
        if (search) params.append('search', search);
        
        return `/admin/users?${params.toString()}`;
      },
      providesTags: (result) =>
        result?.users
          ? [
              ...result.users.map(({ _id }) => ({ type: 'User', id: _id })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        dispatch(setAdminLoading(true));
        try {
          const { data } = await queryFulfilled;
          dispatch(setUsers(data.users || []));
          dispatch(setUserPagination({
            page: data.page || 1,
            limit: data.limit || 10,
            total: data.total || 0,
            totalPages: data.totalPages || 0,
          }));
        } catch (error) {
          dispatch(setAdminError(error.error?.data?.message || 'Failed to fetch users'));
        }
      },
    }),

    // Get single user by ID
    getUser: builder.query({
      query: (id) => `/admin/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),

    // Create new user
    createUser: builder.mutation({
      query: (userData) => ({
        url: '/admin/users',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
      async onQueryStarted(userData, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(addUserToStore(data.user));
        } catch (error) {
          // Error handling is done by the component
        }
      },
    }),

    // Update existing user
    updateUser: builder.mutation({
      query: ({ id, ...userData }) => ({
        url: `/admin/users/${id}`,
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
      ],
      async onQueryStarted({ id, ...userData }, { dispatch, queryFulfilled }) {
        // Optimistic update
        const patchResult = dispatch(
          adminApi.util.updateQueryData('getUsers', undefined, (draft) => {
            const user = draft.users?.find((u) => u._id === id);
            if (user) {
              Object.assign(user, userData);
            }
          })
        );
        
        try {
          const { data } = await queryFulfilled;
          dispatch(updateUserInStore(data.user));
        } catch (error) {
          // Revert optimistic update on error
          patchResult.undo();
        }
      },
    }),

    // Delete user
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
      ],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        // Optimistic update
        const patchResult = dispatch(
          adminApi.util.updateQueryData('getUsers', undefined, (draft) => {
            if (draft.users) {
              draft.users = draft.users.filter((u) => u._id !== id);
            }
          })
        );
        
        try {
          await queryFulfilled;
          dispatch(removeUser(id));
        } catch (error) {
          // Revert optimistic update on error
          patchResult.undo();
        }
      },
    }),

    // Activate/Deactivate user
    toggleUserStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/admin/users/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
      ],
    }),

    // Change user role
    changeUserRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `/admin/users/${id}/role`,
        method: 'PUT',
        body: { role },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
      ],
    }),

    // Reset user password
    resetUserPassword: builder.mutation({
      query: ({ id, newPassword }) => ({
        url: `/admin/users/${id}/reset-password`,
        method: 'PUT',
        body: { newPassword },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],
    }),

    // Bulk user operations
    bulkUpdateUsers: builder.mutation({
      query: ({ userIds, updateData }) => ({
        url: '/admin/users/bulk-update',
        method: 'PUT',
        body: { userIds, updateData },
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    bulkDeleteUsers: builder.mutation({
      query: (userIds) => ({
        url: '/admin/users/bulk-delete',
        method: 'DELETE',
        body: { userIds },
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    // Reports and Analytics Endpoints
    
    // Get comprehensive clinic reports
    getClinicReports: builder.query({
      query: ({ 
        startDate = '', 
        endDate = '', 
        type = 'overview',
        doctorId = '',
        format = 'json'
      } = {}) => {
        const params = new URLSearchParams({ type, format });
        
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        if (doctorId) params.append('doctorId', doctorId);
        
        return `/admin/reports?${params.toString()}`;
      },
      providesTags: ['Dashboard'],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        dispatch(setReportsLoading(true));
        try {
          const { data } = await queryFulfilled;
          dispatch(setReportsData(data));
        } catch (error) {
          dispatch(setReportsError(error.error?.data?.message || 'Failed to fetch reports'));
        }
      },
    }),

    // Get appointment analytics
    getAppointmentAnalytics: builder.query({
      query: ({ period = 'month', doctorId = '' } = {}) => {
        const params = new URLSearchParams({ period });
        if (doctorId) params.append('doctorId', doctorId);
        return `/admin/analytics/appointments?${params.toString()}`;
      },
      providesTags: ['Dashboard'],
    }),

    // Get patient analytics
    getPatientAnalytics: builder.query({
      query: ({ period = 'month' } = {}) => `/admin/analytics/patients?period=${period}`,
      providesTags: ['Dashboard'],
    }),

    // Get revenue reports
    getRevenueReports: builder.query({
      query: ({ startDate = '', endDate = '', groupBy = 'day' } = {}) => {
        const params = new URLSearchParams({ groupBy });
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        return `/admin/reports/revenue?${params.toString()}`;
      },
      providesTags: ['Dashboard'],
    }),

    // Get performance metrics
    getPerformanceMetrics: builder.query({
      query: ({ period = 'month', metric = 'all' } = {}) => {
        return `/admin/analytics/performance?period=${period}&metric=${metric}`;
      },
      providesTags: ['Dashboard'],
    }),

    // Export reports
    exportReport: builder.mutation({
      query: ({ type, format = 'csv', filters = {} }) => ({
        url: '/admin/reports/export',
        method: 'POST',
        body: { type, format, filters },
        responseHandler: (response) => response.blob(),
      }),
    }),

    // System Settings Endpoints
    
    // Get system settings
    getSystemSettings: builder.query({
      query: () => '/admin/settings',
      providesTags: ['Settings'],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        dispatch(setSystemSettingsLoading(true));
        try {
          const { data } = await queryFulfilled;
          dispatch(setSystemSettingsData(data.settings));
        } catch (error) {
          dispatch(setSystemSettingsError(error.error?.data?.message || 'Failed to fetch settings'));
        }
      },
    }),

    // Update system settings
    updateSystemSettings: builder.mutation({
      query: (settings) => ({
        url: '/admin/settings',
        method: 'PUT',
        body: settings,
      }),
      invalidatesTags: ['Settings'],
      async onQueryStarted(settings, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setSystemSettingsData(data.settings));
        } catch (error) {
          console.error('Settings update failed:', error);
        }
      },
    }),

    // Get system logs
    getSystemLogs: builder.query({
      query: ({ 
        page = 1, 
        limit = 50, 
        level = '', 
        startDate = '', 
        endDate = '' 
      } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        
        if (level) params.append('level', level);
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        
        return `/admin/logs?${params.toString()}`;
      },
      providesTags: ['Logs'],
    }),

    // Get audit trail
    getAuditTrail: builder.query({
      query: ({ 
        page = 1, 
        limit = 50, 
        userId = '', 
        action = '', 
        startDate = '', 
        endDate = '' 
      } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        
        if (userId) params.append('userId', userId);
        if (action) params.append('action', action);
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        
        return `/admin/audit?${params.toString()}`;
      },
      providesTags: ['Audit'],
    }),

    // System backup operations
    createBackup: builder.mutation({
      query: ({ type = 'full', description = '' }) => ({
        url: '/admin/backup',
        method: 'POST',
        body: { type, description },
      }),
    }),

    getBackups: builder.query({
      query: () => '/admin/backups',
      providesTags: ['Backup'],
    }),

    restoreBackup: builder.mutation({
      query: (backupId) => ({
        url: `/admin/backup/${backupId}/restore`,
        method: 'POST',
      }),
    }),

    // System maintenance
    getSystemHealth: builder.query({
      query: () => '/admin/health',
      providesTags: ['Health'],
    }),

    runSystemMaintenance: builder.mutation({
      query: ({ tasks = [] }) => ({
        url: '/admin/maintenance',
        method: 'POST',
        body: { tasks },
      }),
    }),

    // Database operations
    getDatabaseStats: builder.query({
      query: () => '/admin/database/stats',
      providesTags: ['Database'],
    }),

    optimizeDatabase: builder.mutation({
      query: () => ({
        url: '/admin/database/optimize',
        method: 'POST',
      }),
    }),
  }),
});

// Export hooks for components to use
export const {
  // User management hooks
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useToggleUserStatusMutation,
  useChangeUserRoleMutation,
  useResetUserPasswordMutation,
  useBulkUpdateUsersMutation,
  useBulkDeleteUsersMutation,
  
  // Reports and analytics hooks
  useGetClinicReportsQuery,
  useGetAppointmentAnalyticsQuery,
  useGetPatientAnalyticsQuery,
  useGetRevenueReportsQuery,
  useGetPerformanceMetricsQuery,
  useExportReportMutation,
  
  // System settings hooks
  useGetSystemSettingsQuery,
  useUpdateSystemSettingsMutation,
  useGetSystemLogsQuery,
  useGetAuditTrailQuery,
  
  // System operations hooks
  useCreateBackupMutation,
  useGetBackupsQuery,
  useRestoreBackupMutation,
  useGetSystemHealthQuery,
  useRunSystemMaintenanceMutation,
  useGetDatabaseStatsQuery,
  useOptimizeDatabaseMutation,
  
  // Lazy query hooks
  useLazyGetUsersQuery,
  useLazyGetClinicReportsQuery,
  useLazyGetSystemLogsQuery,
} = adminApi;

// Export endpoints for direct access if needed
export const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  changeUserRole,
  resetUserPassword,
  bulkUpdateUsers,
  bulkDeleteUsers,
  getClinicReports,
  getAppointmentAnalytics,
  getPatientAnalytics,
  getRevenueReports,
  getPerformanceMetrics,
  exportReport,
  getSystemSettings,
  updateSystemSettings,
  getSystemLogs,
  getAuditTrail,
  createBackup,
  getBackups,
  restoreBackup,
  getSystemHealth,
  runSystemMaintenance,
  getDatabaseStats,
  optimizeDatabase,
} = adminApi.endpoints;