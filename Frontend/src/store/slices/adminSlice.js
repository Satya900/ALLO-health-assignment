import { createSlice, createSelector } from "@reduxjs/toolkit";

/**
 * Admin slice for managing admin-specific state
 */
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    // User management state
    users: [],
    userPagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
    selectedUsers: [],

    // System settings state
    systemSettings: {},

    // Reports and analytics state
    reports: {
      overview: null,
      appointments: null,
      patients: null,
      revenue: null,
      performance: null,
    },

    // System health and monitoring
    systemHealth: {
      score: 95,
      status: "Excellent",
      issues: [],
      lastCheck: null,
      uptime: null,
      performance: {
        cpu: 0,
        memory: 0,
        disk: 0,
        network: 0,
      },
    },

    // System alerts and notifications
    systemAlerts: [],

    // System logs and audit trail
    systemLogs: [],
    auditTrail: [],

    // Backup and maintenance
    backups: [],
    maintenanceTasks: [],

    // Loading states
    loading: {
      users: false,
      settings: false,
      reports: false,
      health: false,
      logs: false,
      audit: false,
      backup: false,
    },

    // Error states
    error: {
      users: null,
      settings: null,
      reports: null,
      health: null,
      logs: null,
      audit: null,
      backup: null,
    },
  },
  reducers: {
    // User management actions
    setAdminLoading: (state, action) => {
      state.loading.users = action.payload;
    },
    setAdminError: (state, action) => {
      state.error.users = action.payload;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
      state.loading.users = false;
      state.error.users = null;
    },
    addUser: (state, action) => {
      state.users.push(action.payload);
    },
    updateUser: (state, action) => {
      const index = state.users.findIndex(
        (user) => user._id === action.payload._id
      );
      if (index !== -1) {
        state.users[index] = { ...state.users[index], ...action.payload };
      }
    },
    removeUser: (state, action) => {
      state.users = state.users.filter((user) => user._id !== action.payload);
    },
    setUserPagination: (state, action) => {
      state.userPagination = action.payload;
    },
    setSelectedUsers: (state, action) => {
      state.selectedUsers = action.payload;
    },
    toggleUserSelection: (state, action) => {
      const userId = action.payload;
      const index = state.selectedUsers.indexOf(userId);
      if (index > -1) {
        state.selectedUsers.splice(index, 1);
      } else {
        state.selectedUsers.push(userId);
      }
    },
    clearUserSelection: (state) => {
      state.selectedUsers = [];
    },

    // Reports and analytics actions
    setReportsLoading: (state, action) => {
      state.loading.reports = action.payload;
    },
    setReportsError: (state, action) => {
      state.error.reports = action.payload;
    },
    setReportsData: (state, action) => {
      state.reports = { ...state.reports, ...action.payload };
      state.loading.reports = false;
      state.error.reports = null;
    },
    updateReportData: (state, action) => {
      const { type, data } = action.payload;
      state.reports[type] = data;
    },

    // System settings actions
    setSystemSettingsLoading: (state, action) => {
      state.loading.settings = action.payload;
    },
    setSystemSettingsError: (state, action) => {
      state.error.settings = action.payload;
    },
    setSystemSettingsData: (state, action) => {
      state.systemSettings = action.payload;
      state.loading.settings = false;
      state.error.settings = null;
    },
    updateSystemSettings: (state, action) => {
      state.systemSettings = { ...state.systemSettings, ...action.payload };
    },

    // System health and monitoring actions
    setSystemHealth: (state, action) => {
      state.systemHealth = { ...state.systemHealth, ...action.payload };
      state.loading.health = false;
      state.error.health = null;
    },
    updateSystemHealth: (state, action) => {
      state.systemHealth = { ...state.systemHealth, ...action.payload };
    },
    setHealthLoading: (state, action) => {
      state.loading.health = action.payload;
    },
    setHealthError: (state, action) => {
      state.error.health = action.payload;
    },

    // System alerts and notifications actions
    setSystemAlerts: (state, action) => {
      state.systemAlerts = action.payload;
    },
    addSystemAlert: (state, action) => {
      state.systemAlerts.unshift(action.payload);
    },
    removeSystemAlert: (state, action) => {
      state.systemAlerts = state.systemAlerts.filter(
        (alert) => alert.id !== action.payload
      );
    },
    markAlertAsRead: (state, action) => {
      const alert = state.systemAlerts.find(
        (alert) => alert.id === action.payload
      );
      if (alert) {
        alert.read = true;
      }
    },
    clearAllAlerts: (state) => {
      state.systemAlerts = [];
    },

    // System logs and audit trail actions
    setSystemLogs: (state, action) => {
      state.systemLogs = action.payload;
      state.loading.logs = false;
      state.error.logs = null;
    },
    setAuditTrail: (state, action) => {
      state.auditTrail = action.payload;
      state.loading.audit = false;
      state.error.audit = null;
    },
    setLogsLoading: (state, action) => {
      state.loading.logs = action.payload;
    },
    setLogsError: (state, action) => {
      state.error.logs = action.payload;
    },
    setAuditLoading: (state, action) => {
      state.loading.audit = action.payload;
    },
    setAuditError: (state, action) => {
      state.error.audit = action.payload;
    },

    // Backup and maintenance actions
    setBackups: (state, action) => {
      state.backups = action.payload;
      state.loading.backup = false;
      state.error.backup = null;
    },
    addBackup: (state, action) => {
      state.backups.unshift(action.payload);
    },
    removeBackup: (state, action) => {
      state.backups = state.backups.filter(
        (backup) => backup.id !== action.payload
      );
    },
    setMaintenanceTasks: (state, action) => {
      state.maintenanceTasks = action.payload;
    },
    updateMaintenanceTask: (state, action) => {
      const { id, updates } = action.payload;
      const task = state.maintenanceTasks.find((task) => task.id === id);
      if (task) {
        Object.assign(task, updates);
      }
    },
    setBackupLoading: (state, action) => {
      state.loading.backup = action.payload;
    },
    setBackupError: (state, action) => {
      state.error.backup = action.payload;
    },

    // Error clearing actions
    clearUsersError: (state) => {
      state.error.users = null;
    },
    clearSettingsError: (state) => {
      state.error.settings = null;
    },
    clearReportsError: (state) => {
      state.error.reports = null;
    },
    clearHealthError: (state) => {
      state.error.health = null;
    },
    clearLogsError: (state) => {
      state.error.logs = null;
    },
    clearAuditError: (state) => {
      state.error.audit = null;
    },
    clearBackupError: (state) => {
      state.error.backup = null;
    },
    clearAllErrors: (state) => {
      state.error = {
        users: null,
        settings: null,
        reports: null,
        health: null,
        logs: null,
        audit: null,
        backup: null,
      };
    },

    // Reset state actions
    resetAdminState: (state) => {
      return {
        ...state,
        users: [],
        selectedUsers: [],
        systemSettings: {},
        reports: {
          overview: null,
          appointments: null,
          patients: null,
          revenue: null,
          performance: null,
        },
        systemAlerts: [],
        systemLogs: [],
        auditTrail: [],
        backups: [],
        maintenanceTasks: [],
        loading: {
          users: false,
          settings: false,
          reports: false,
          health: false,
          logs: false,
          audit: false,
          backup: false,
        },
        error: {
          users: null,
          settings: null,
          reports: null,
          health: null,
          logs: null,
          audit: null,
          backup: null,
        },
      };
    },
  },
});

export const {
  // User management actions
  setAdminLoading,
  setAdminError,
  setUsers,
  addUser,
  updateUser,
  removeUser,
  setUserPagination,
  setSelectedUsers,
  toggleUserSelection,
  clearUserSelection,

  // Reports and analytics actions
  setReportsLoading,
  setReportsError,
  setReportsData,
  updateReportData,

  // System settings actions
  setSystemSettingsLoading,
  setSystemSettingsError,
  setSystemSettingsData,
  updateSystemSettings,

  // System health actions
  setSystemHealth,
  updateSystemHealth,
  setHealthLoading,
  setHealthError,

  // System alerts actions
  setSystemAlerts,
  addSystemAlert,
  removeSystemAlert,
  markAlertAsRead,
  clearAllAlerts,

  // System logs and audit actions
  setSystemLogs,
  setAuditTrail,
  setLogsLoading,
  setLogsError,
  setAuditLoading,
  setAuditError,

  // Backup and maintenance actions
  setBackups,
  addBackup,
  removeBackup,
  setMaintenanceTasks,
  updateMaintenanceTask,
  setBackupLoading,
  setBackupError,

  // Error clearing actions
  clearUsersError,
  clearSettingsError,
  clearReportsError,
  clearHealthError,
  clearLogsError,
  clearAuditError,
  clearBackupError,
  clearAllErrors,

  // Reset actions
  resetAdminState,
} = adminSlice.actions;

// Basic selectors
export const selectUsers = (state) => state.admin.users;
export const selectUserPagination = (state) => state.admin.userPagination;
export const selectSelectedUsers = (state) => state.admin.selectedUsers;
export const selectSystemSettings = (state) => state.admin.systemSettings;
export const selectReports = (state) => state.admin.reports;
export const selectSystemHealth = (state) => state.admin.systemHealth;
export const selectSystemAlerts = (state) => state.admin.systemAlerts;
export const selectSystemLogs = (state) => state.admin.systemLogs;
export const selectAuditTrail = (state) => state.admin.auditTrail;
export const selectBackups = (state) => state.admin.backups;
export const selectMaintenanceTasks = (state) => state.admin.maintenanceTasks;
export const selectAdminLoading = (state) => state.admin.loading;
export const selectAdminError = (state) => state.admin.error;

// Memoized computed selectors
export const selectActiveUsers = createSelector([selectUsers], (users) =>
  users.filter((user) => user.status === "active")
);

export const selectInactiveUsers = createSelector([selectUsers], (users) =>
  users.filter((user) => user.status === "inactive")
);

export const selectUsersByRole = createSelector(
  [selectUsers, (state, role) => role],
  (users, role) => users.filter((user) => user.role === role)
);

export const selectDoctors = createSelector([selectUsers], (users) =>
  users.filter((user) => user.role === "doctor")
);

export const selectFrontDeskUsers = createSelector([selectUsers], (users) =>
  users.filter((user) => user.role === "frontdesk")
);

export const selectAdminUsers = createSelector([selectUsers], (users) =>
  users.filter((user) => user.role === "admin")
);

export const selectUnreadAlerts = createSelector(
  [selectSystemAlerts],
  (alerts) => alerts.filter((alert) => !alert.read)
);

export const selectCriticalAlerts = createSelector(
  [selectSystemAlerts],
  (alerts) => alerts.filter((alert) => alert.severity === "high" && !alert.read)
);

export const selectRecentAlerts = createSelector(
  [selectSystemAlerts],
  (alerts) => {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return alerts.filter((alert) => new Date(alert.timestamp) > oneDayAgo);
  }
);

export const selectSystemHealthScore = (state) =>
  state.admin.systemHealth.score;

export const selectSystemStatus = (state) => state.admin.systemHealth.status;

export const selectRecentBackups = createSelector(
  [selectBackups],
  (backups) => backups.slice(0, 5) // Last 5 backups
);

export const selectPendingMaintenanceTasks = createSelector(
  [selectMaintenanceTasks],
  (tasks) => tasks.filter((task) => task.status === "pending")
);

export const selectCompletedMaintenanceTasks = createSelector(
  [selectMaintenanceTasks],
  (tasks) => tasks.filter((task) => task.status === "completed")
);

// Loading state selectors
export const selectIsUsersLoading = (state) => state.admin.loading.users;
export const selectIsSettingsLoading = (state) => state.admin.loading.settings;
export const selectIsReportsLoading = (state) => state.admin.loading.reports;
export const selectIsHealthLoading = (state) => state.admin.loading.health;
export const selectIsLogsLoading = (state) => state.admin.loading.logs;
export const selectIsAuditLoading = (state) => state.admin.loading.audit;
export const selectIsBackupLoading = (state) => state.admin.loading.backup;

// Error state selectors
export const selectUsersError = (state) => state.admin.error.users;
export const selectSettingsError = (state) => state.admin.error.settings;
export const selectReportsError = (state) => state.admin.error.reports;
export const selectHealthError = (state) => state.admin.error.health;
export const selectLogsError = (state) => state.admin.error.logs;
export const selectAuditError = (state) => state.admin.error.audit;
export const selectBackupError = (state) => state.admin.error.backup;

export default adminSlice.reducer;
