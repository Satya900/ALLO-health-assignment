import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import {
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
  useRefreshDashboardMutation,
} from "../store/api/dashboardApi";
import {
  selectDashboard,
  selectDashboardStats,
  selectPatientStats,
  selectAppointmentStats,
  selectQueueStats,
  selectDoctorStats,
  selectRecentActivity,
  selectQuickStats,
  selectDashboardLoading,
  selectDashboardError,
  selectLastUpdated,
  selectTotalActiveUsers,
  selectTodayActivity,
  selectWeeklyTrends,
  selectSystemHealth,
  clearDashboardError,
} from "../store/slices/dashboardSlice";

/**
 * Custom hook for dashboard functionality
 * Provides dashboard state and methods for fetching dashboard data
 */
export const useDashboard = (options = {}) => {
  const dispatch = useDispatch();

  // Redux state
  const dashboard = useSelector(selectDashboard);
  const stats = useSelector(selectDashboardStats);
  const patientStats = useSelector(selectPatientStats);
  const appointmentStats = useSelector(selectAppointmentStats);
  const queueStats = useSelector(selectQueueStats);
  const doctorStats = useSelector(selectDoctorStats);
  const recentActivity = useSelector(selectRecentActivity);
  const quickStats = useSelector(selectQuickStats);
  const loading = useSelector(selectDashboardLoading);
  const error = useSelector(selectDashboardError);
  const lastUpdated = useSelector(selectLastUpdated);

  // Computed selectors
  const totalActiveUsers = useSelector(selectTotalActiveUsers);
  const todayActivity = useSelector(selectTodayActivity);
  const weeklyTrends = useSelector(selectWeeklyTrends);
  const systemHealth = useSelector(selectSystemHealth);

  // RTK Query hooks
  const {
    data: dashboardData,
    isLoading: isLoadingDashboard,
    isFetching: isFetchingDashboard,
    error: dashboardQueryError,
    refetch: refetchDashboard,
  } = useGetDashboardStatsQuery(
    {
      startDate: options.startDate,
      endDate: options.endDate,
    },
    {
      skip: options.skipDashboard,
      pollingInterval: options.pollingInterval || 60000, // Poll every minute
    }
  );

  const { data: todaysOverview, isLoading: isLoadingToday } =
    useGetTodaysOverviewQuery(undefined, {
      skip: options.skipToday,
    });

  const { data: weeklySummary, isLoading: isLoadingWeekly } =
    useGetWeeklySummaryQuery(
      {
        startDate: options.weekStartDate,
        endDate: options.weekEndDate,
      },
      {
        skip: options.skipWeekly,
      }
    );

  const { data: monthlySummary, isLoading: isLoadingMonthly } =
    useGetMonthlySummaryQuery(
      {
        year: options.year,
        month: options.month,
      },
      {
        skip: options.skipMonthly,
      }
    );

  const { data: recentActivityData, isLoading: isLoadingActivity } =
    useGetRecentActivityQuery(
      {
        limit: options.activityLimit || 10,
        type: options.activityType,
      },
      {
        skip: options.skipActivity,
      }
    );

  const { data: quickStatsData, isLoading: isLoadingQuickStats } =
    useGetQuickStatsQuery(undefined, {
      skip: options.skipQuickStats,
    });

  // Mutations
  const [refreshDashboard, { isLoading: isRefreshing }] =
    useRefreshDashboardMutation();

  // Actions
  const handleClearError = useCallback(() => {
    dispatch(clearDashboardError());
  }, [dispatch]);

  const handleRefreshDashboard = useCallback(async () => {
    try {
      await refreshDashboard().unwrap();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error.data?.message || error.message || "Failed to refresh dashboard",
      };
    }
  }, [refreshDashboard]);

  // Get formatted statistics for display
  const getFormattedStats = useCallback(() => {
    return {
      patients: {
        ...patientStats,
        growth:
          patientStats.newThisMonth > 0
            ? Math.round(
                ((patientStats.newThisMonth - patientStats.newToday) /
                  patientStats.newThisMonth) *
                  100
              )
            : 0,
      },
      appointments: {
        ...appointmentStats,
        completionRate:
          appointmentStats.total > 0
            ? Math.round(
                (appointmentStats.completed / appointmentStats.total) * 100
              )
            : 0,
        cancellationRate:
          appointmentStats.total > 0
            ? Math.round(
                (appointmentStats.canceled / appointmentStats.total) * 100
              )
            : 0,
      },
      queue: {
        ...queueStats,
        efficiency:
          queueStats.total > 0
            ? Math.round((queueStats.completed / queueStats.total) * 100)
            : 0,
      },
      doctors: {
        ...doctorStats,
        activeRate:
          doctorStats.total > 0
            ? Math.round((doctorStats.active / doctorStats.total) * 100)
            : 0,
      },
    };
  }, [patientStats, appointmentStats, queueStats, doctorStats]);

  // Get dashboard summary for quick overview
  const getDashboardSummary = useCallback(() => {
    return {
      totalPatients: patientStats.total,
      todayAppointments: appointmentStats.today,
      queueLength: queueStats.total,
      activeDoctors: doctorStats.active,
      systemHealth: systemHealth.score,
      lastUpdated,
    };
  }, [
    patientStats.total,
    appointmentStats.today,
    queueStats.total,
    doctorStats.active,
    systemHealth.score,
    lastUpdated,
  ]);

  // Get key performance indicators
  const getKPIs = useCallback(() => {
    const formattedStats = getFormattedStats();

    return [
      {
        title: "Patient Growth",
        value: `${patientStats.newThisMonth}`,
        subtitle: "New this month",
        trend:
          patientStats.newThisMonth > patientStats.newToday ? "up" : "neutral",
        trendValue: `+${patientStats.newToday} today`,
        color: "blue",
      },
      {
        title: "Appointment Rate",
        value: `${formattedStats.appointments.completionRate}%`,
        subtitle: "Completion rate",
        trend: formattedStats.appointments.completionRate >= 80 ? "up" : "down",
        trendValue: `${appointmentStats.completed}/${appointmentStats.total}`,
        color:
          formattedStats.appointments.completionRate >= 80 ? "green" : "yellow",
      },
      {
        title: "Queue Efficiency",
        value: `${formattedStats.queue.efficiency}%`,
        subtitle: "Patients processed",
        trend: formattedStats.queue.efficiency >= 70 ? "up" : "down",
        trendValue: `${queueStats.averageWaitTime}min avg wait`,
        color: formattedStats.queue.efficiency >= 70 ? "green" : "red",
      },
      {
        title: "Doctor Availability",
        value: `${doctorStats.active}`,
        subtitle: "Active doctors",
        trend: doctorStats.active >= doctorStats.total * 0.8 ? "up" : "down",
        trendValue: `${formattedStats.doctors.activeRate}% active`,
        color:
          doctorStats.active >= doctorStats.total * 0.8 ? "green" : "yellow",
      },
    ];
  }, [
    getFormattedStats,
    patientStats,
    appointmentStats,
    queueStats,
    doctorStats,
  ]);

  // Check if data needs refresh
  const needsRefresh = useCallback(() => {
    if (!lastUpdated) return true;

    const now = new Date();
    const updated = new Date(lastUpdated);
    const diffMinutes = Math.floor((now - updated) / (1000 * 60));

    return diffMinutes > 5; // Refresh if data is older than 5 minutes
  }, [lastUpdated]);

  // Combined loading state
  const isLoading =
    loading ||
    isLoadingDashboard ||
    isFetchingDashboard ||
    isLoadingToday ||
    isLoadingWeekly ||
    isLoadingMonthly ||
    isLoadingActivity ||
    isLoadingQuickStats;

  // Combined error state
  const combinedError = error || dashboardQueryError?.data?.message;

  return {
    // State
    dashboard,
    stats,
    patientStats,
    appointmentStats,
    queueStats,
    doctorStats,
    recentActivity,
    quickStats,
    loading: isLoading,
    error: combinedError,
    lastUpdated,

    // Computed data
    totalActiveUsers,
    todayActivity,
    weeklyTrends,
    systemHealth,

    // External data
    todaysOverview,
    weeklySummary,
    monthlySummary,

    // Loading states
    isRefreshing,
    isFetching: isFetchingDashboard,

    // Actions
    handleClearError,
    handleRefreshDashboard,
    refetch: refetchDashboard,

    // Utilities
    getFormattedStats,
    getDashboardSummary,
    getKPIs,
    needsRefresh,
  };
};

/**
 * Hook for specific dashboard widgets
 */
export const useDashboardWidget = (widgetType, options = {}) => {
  const dispatch = useDispatch();

  // Widget-specific queries
  const patientQuery = useGetPatientStatsQuery(
    { period: options.period },
    {
      skip: widgetType !== "patients",
    }
  );

  const appointmentQuery = useGetAppointmentStatsQuery(
    {
      period: options.period,
      doctorId: options.doctorId,
    },
    {
      skip: widgetType !== "appointments",
    }
  );

  const queueQuery = useGetQueueStatsQuery(
    {
      doctorId: options.doctorId,
      date: options.date,
    },
    {
      skip: widgetType !== "queue",
    }
  );

  const doctorQuery = useGetDoctorStatsQuery(undefined, {
    skip: widgetType !== "doctors",
  });

  const activityQuery = useGetRecentActivityQuery(
    {
      limit: options.limit || 5,
      type: options.activityType,
    },
    {
      skip: widgetType !== "activity",
    }
  );

  // Get the appropriate query based on widget type
  const getWidgetQuery = () => {
    switch (widgetType) {
      case "patients":
        return patientQuery;
      case "appointments":
        return appointmentQuery;
      case "queue":
        return queueQuery;
      case "doctors":
        return doctorQuery;
      case "activity":
        return activityQuery;
      default:
        return { data: null, isLoading: false, error: null };
    }
  };

  const widgetQuery = getWidgetQuery();

  return {
    data: widgetQuery.data,
    loading: widgetQuery.isLoading,
    error: widgetQuery.error?.data?.message,
    refetch: widgetQuery.refetch,
  };
};
