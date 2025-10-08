import { baseApi } from './baseApi';
import {
  setDashboardLoading,
  setDashboardError,
  setDashboardStats,
  updatePatientStats,
  updateAppointmentStats,
  updateQueueStats,
  updateDoctorStats,
  setRecentActivity,
  setQuickStats,
} from '../slices/dashboardSlice';

// Dashboard API endpoints
export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get comprehensive dashboard statistics
    getDashboardStats: builder.query({
      query: ({ startDate = '', endDate = '' } = {}) => {
        const params = new URLSearchParams();
        
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        
        return `/dashboard/stats?${params.toString()}`;
      },
      providesTags: ['Dashboard'],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        dispatch(setDashboardLoading(true));
        try {
          const { data } = await queryFulfilled;
          dispatch(setDashboardStats(data.stats));
        } catch (error) {
          dispatch(setDashboardError(error.error?.data?.message || 'Failed to fetch dashboard stats'));
        }
      },
    }),

    // Get patient statistics
    getPatientStats: builder.query({
      query: ({ period = 'today' } = {}) => `/dashboard/patients/stats?period=${period}`,
      providesTags: ['Dashboard', 'Patient'],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(updatePatientStats(data.stats));
        } catch (error) {
          console.error('Failed to fetch patient stats:', error);
        }
      },
    }),

    // Get appointment statistics
    getAppointmentStats: builder.query({
      query: ({ period = 'today', doctorId = '' } = {}) => {
        const params = new URLSearchParams({ period });
        if (doctorId) params.append('doctorId', doctorId);
        return `/dashboard/appointments/stats?${params.toString()}`;
      },
      providesTags: ['Dashboard', 'Appointment'],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(updateAppointmentStats(data.stats));
        } catch (error) {
          console.error('Failed to fetch appointment stats:', error);
        }
      },
    }),

    // Get queue statistics
    getQueueStats: builder.query({
      query: ({ doctorId = '', date = '' } = {}) => {
        const params = new URLSearchParams();
        if (doctorId) params.append('doctorId', doctorId);
        if (date) params.append('date', date);
        return `/dashboard/queue/stats?${params.toString()}`;
      },
      providesTags: ['Dashboard', 'Queue'],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(updateQueueStats(data.stats));
        } catch (error) {
          console.error('Failed to fetch queue stats:', error);
        }
      },
    }),

    // Get doctor statistics
    getDoctorStats: builder.query({
      query: () => '/dashboard/doctors/stats',
      providesTags: ['Dashboard', 'Doctor'],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(updateDoctorStats(data.stats));
        } catch (error) {
          console.error('Failed to fetch doctor stats:', error);
        }
      },
    }),

    // Get recent activity
    getRecentActivity: builder.query({
      query: ({ limit = 10, type = '' } = {}) => {
        const params = new URLSearchParams({ limit: limit.toString() });
        if (type) params.append('type', type);
        return `/dashboard/activity?${params.toString()}`;
      },
      providesTags: ['Dashboard'],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setRecentActivity(data.activities));
        } catch (error) {
          console.error('Failed to fetch recent activity:', error);
        }
      },
    }),

    // Get quick stats for widgets
    getQuickStats: builder.query({
      query: () => '/dashboard/quick-stats',
      providesTags: ['Dashboard'],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setQuickStats(data.stats));
        } catch (error) {
          console.error('Failed to fetch quick stats:', error);
        }
      },
    }),

    // Get today's overview
    getTodaysOverview: builder.query({
      query: () => '/dashboard/today',
      providesTags: ['Dashboard'],
    }),

    // Get weekly summary
    getWeeklySummary: builder.query({
      query: ({ startDate = '', endDate = '' } = {}) => {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        return `/dashboard/weekly?${params.toString()}`;
      },
      providesTags: ['Dashboard'],
    }),

    // Get monthly summary
    getMonthlySummary: builder.query({
      query: ({ year = new Date().getFullYear(), month = new Date().getMonth() + 1 } = {}) => {
        return `/dashboard/monthly?year=${year}&month=${month}`;
      },
      providesTags: ['Dashboard'],
    }),

    // Get appointment trends
    getAppointmentTrends: builder.query({
      query: ({ period = '7days', doctorId = '' } = {}) => {
        const params = new URLSearchParams({ period });
        if (doctorId) params.append('doctorId', doctorId);
        return `/dashboard/trends/appointments?${params.toString()}`;
      },
      providesTags: ['Dashboard'],
    }),

    // Get patient demographics
    getPatientDemographics: builder.query({
      query: () => '/dashboard/demographics',
      providesTags: ['Dashboard', 'Patient'],
    }),

    // Get doctor performance metrics
    getDoctorPerformance: builder.query({
      query: ({ period = 'month', doctorId = '' } = {}) => {
        const params = new URLSearchParams({ period });
        if (doctorId) params.append('doctorId', doctorId);
        return `/dashboard/performance/doctors?${params.toString()}`;
      },
      providesTags: ['Dashboard', 'Doctor'],
    }),

    // Get system health metrics
    getSystemHealth: builder.query({
      query: () => '/dashboard/health',
      providesTags: ['Dashboard'],
    }),

    // Get revenue statistics (if applicable)
    getRevenueStats: builder.query({
      query: ({ period = 'month', startDate = '', endDate = '' } = {}) => {
        const params = new URLSearchParams({ period });
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        return `/dashboard/revenue?${params.toString()}`;
      },
      providesTags: ['Dashboard'],
    }),

    // Get waiting time analytics
    getWaitingTimeAnalytics: builder.query({
      query: ({ period = 'week', doctorId = '' } = {}) => {
        const params = new URLSearchParams({ period });
        if (doctorId) params.append('doctorId', doctorId);
        return `/dashboard/analytics/waiting-time?${params.toString()}`;
      },
      providesTags: ['Dashboard', 'Queue'],
    }),

    // Get appointment completion rates
    getCompletionRates: builder.query({
      query: ({ period = 'month', doctorId = '' } = {}) => {
        const params = new URLSearchParams({ period });
        if (doctorId) params.append('doctorId', doctorId);
        return `/dashboard/analytics/completion-rates?${params.toString()}`;
      },
      providesTags: ['Dashboard', 'Appointment'],
    }),

    // Get peak hours analysis
    getPeakHoursAnalysis: builder.query({
      query: ({ period = 'week' } = {}) => `/dashboard/analytics/peak-hours?period=${period}`,
      providesTags: ['Dashboard'],
    }),

    // Get no-show statistics
    getNoShowStats: builder.query({
      query: ({ period = 'month', doctorId = '' } = {}) => {
        const params = new URLSearchParams({ period });
        if (doctorId) params.append('doctorId', doctorId);
        return `/dashboard/analytics/no-shows?${params.toString()}`;
      },
      providesTags: ['Dashboard', 'Appointment'],
    }),

    // Export dashboard data
    exportDashboardData: builder.mutation({
      query: ({ format = 'csv', period = 'month', includeCharts = false } = {}) => ({
        url: '/dashboard/export',
        method: 'POST',
        body: { format, period, includeCharts },
        responseHandler: (response) => response.blob(),
      }),
    }),

    // Refresh all dashboard data
    refreshDashboard: builder.mutation({
      query: () => ({
        url: '/dashboard/refresh',
        method: 'POST',
      }),
      invalidatesTags: ['Dashboard'],
    }),
  }),
});

// Export hooks for components to use
export const {
  useGetDashboardStatsQuery,
  useGetPatientStatsQuery,
  useGetAppointmentStatsQuery,
  useGetQueueStatsQuery,
  useGetDoctorStatsQuery,
  useGetRecentActivityQuery,
  useGetQuickStatsQuery,
  useGetTodaysOverviewQuery,
  useGetWeeklySummaryQuery,
  useGetMonthlySummaryQuery,
  useGetAppointmentTrendsQuery,
  useGetPatientDemographicsQuery,
  useGetDoctorPerformanceQuery,
  useGetSystemHealthQuery,
  useGetRevenueStatsQuery,
  useGetWaitingTimeAnalyticsQuery,
  useGetCompletionRatesQuery,
  useGetPeakHoursAnalysisQuery,
  useGetNoShowStatsQuery,
  useExportDashboardDataMutation,
  useRefreshDashboardMutation,
  useLazyGetDashboardStatsQuery,
  useLazyGetPatientStatsQuery,
  useLazyGetAppointmentStatsQuery,
  useLazyGetQueueStatsQuery,
  useLazyGetDoctorStatsQuery,
} = dashboardApi;

// Export endpoints for direct access if needed
export const {
  getDashboardStats,
  getPatientStats,
  getAppointmentStats,
  getQueueStats,
  getDoctorStats,
  getRecentActivity,
  getQuickStats,
  getTodaysOverview,
  getWeeklySummary,
  getMonthlySummary,
  getAppointmentTrends,
  getPatientDemographics,
  getDoctorPerformance,
  getSystemHealth,
  getRevenueStats,
  getWaitingTimeAnalytics,
  getCompletionRates,
  getPeakHoursAnalysis,
  getNoShowStats,
  exportDashboardData,
  refreshDashboard,
} = dashboardApi.endpoints;