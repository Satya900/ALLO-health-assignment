import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stats: {
    patients: {
      total: 0,
      newToday: 0,
      newThisWeek: 0,
      newThisMonth: 0,
    },
    appointments: {
      total: 0,
      today: 0,
      thisWeek: 0,
      thisMonth: 0,
      completed: 0,
      canceled: 0,
      upcoming: 0,
    },
    queue: {
      total: 0,
      waiting: 0,
      withDoctor: 0,
      completed: 0,
      urgent: 0,
      averageWaitTime: 0,
    },
    doctors: {
      total: 0,
      active: 0,
      inactive: 0,
      specializations: {},
    },
  },
  recentActivity: [],
  quickStats: {},
  loading: false,
  error: null,
  lastUpdated: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setDashboardLoading: (state, action) => {
      state.loading = action.payload;
    },
    setDashboardError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setDashboardStats: (state, action) => {
      state.stats = { ...state.stats, ...action.payload };
      state.loading = false;
      state.error = null;
      state.lastUpdated = new Date().toISOString();
    },
    updatePatientStats: (state, action) => {
      state.stats.patients = { ...state.stats.patients, ...action.payload };
    },
    updateAppointmentStats: (state, action) => {
      state.stats.appointments = { ...state.stats.appointments, ...action.payload };
    },
    updateQueueStats: (state, action) => {
      state.stats.queue = { ...state.stats.queue, ...action.payload };
    },
    updateDoctorStats: (state, action) => {
      state.stats.doctors = { ...state.stats.doctors, ...action.payload };
    },
    setRecentActivity: (state, action) => {
      state.recentActivity = action.payload;
    },
    addRecentActivity: (state, action) => {
      state.recentActivity.unshift(action.payload);
      // Keep only the last 10 activities
      if (state.recentActivity.length > 10) {
        state.recentActivity = state.recentActivity.slice(0, 10);
      }
    },
    setQuickStats: (state, action) => {
      state.quickStats = { ...state.quickStats, ...action.payload };
    },
    clearDashboardError: (state) => {
      state.error = null;
    },
    resetDashboardState: () => initialState,
  },
});

export const {
  setDashboardLoading,
  setDashboardError,
  setDashboardStats,
  updatePatientStats,
  updateAppointmentStats,
  updateQueueStats,
  updateDoctorStats,
  setRecentActivity,
  addRecentActivity,
  setQuickStats,
  clearDashboardError,
  resetDashboardState,
} = dashboardSlice.actions;

// Selectors
export const selectDashboard = (state) => state.dashboard;
export const selectDashboardStats = (state) => state.dashboard.stats;
export const selectPatientStats = (state) => state.dashboard.stats.patients;
export const selectAppointmentStats = (state) => state.dashboard.stats.appointments;
export const selectQueueStats = (state) => state.dashboard.stats.queue;
export const selectDoctorStats = (state) => state.dashboard.stats.doctors;
export const selectRecentActivity = (state) => state.dashboard.recentActivity;
export const selectQuickStats = (state) => state.dashboard.quickStats;
export const selectDashboardLoading = (state) => state.dashboard.loading;
export const selectDashboardError = (state) => state.dashboard.error;
export const selectLastUpdated = (state) => state.dashboard.lastUpdated;

// Computed selectors
export const selectTotalActiveUsers = (state) => {
  const stats = state.dashboard.stats;
  return stats.patients.total + stats.doctors.active;
};

export const selectTodayActivity = (state) => {
  const stats = state.dashboard.stats;
  return {
    newPatients: stats.patients.newToday,
    appointments: stats.appointments.today,
    queueLength: stats.queue.total,
    completedAppointments: stats.appointments.completed,
  };
};

export const selectWeeklyTrends = (state) => {
  const stats = state.dashboard.stats;
  return {
    newPatients: stats.patients.newThisWeek,
    appointments: stats.appointments.thisWeek,
    completionRate: stats.appointments.thisWeek > 0 
      ? Math.round((stats.appointments.completed / stats.appointments.thisWeek) * 100)
      : 0,
  };
};

export const selectSystemHealth = (state) => {
  const stats = state.dashboard.stats;
  const health = {
    score: 100,
    issues: [],
  };
  
  // Check for potential issues
  if (stats.queue.averageWaitTime > 30) {
    health.score -= 20;
    health.issues.push('High average wait time');
  }
  
  if (stats.doctors.inactive > stats.doctors.active * 0.3) {
    health.score -= 15;
    health.issues.push('Many inactive doctors');
  }
  
  if (stats.appointments.canceled > stats.appointments.total * 0.2) {
    health.score -= 10;
    health.issues.push('High cancellation rate');
  }
  
  return health;
};

export default dashboardSlice.reducer;