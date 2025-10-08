import { useSelector, useDispatch } from 'react-redux';
import { useState, useCallback } from 'react';
import {
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
  useGetClinicReportsQuery,
  useGetSystemSettingsQuery,
  useUpdateSystemSettingsMutation,
} from '../store/api/adminApi';
import {
  selectUsers,
  selectSelectedUsers,
  selectAdminLoading,
  selectAdminError,
  selectUserPagination,
  selectUsersByRole,
  selectActiveUsers,
  selectReports,
  selectSystemSettings,
  setSelectedUsers,
  clearUsersError,
  clearReportsError,
  clearSettingsError,
} from '../store/slices/adminSlice';

/**
 * Custom hook for admin functionality
 * Provides admin state and methods for user management, reports, and system settings
 */
export const useAdmin = (options = {}) => {
  const dispatch = useDispatch();
  
  // Redux state
  const users = useSelector(selectUsers);
  const selectedUsers = useSelector(selectSelectedUsers);
  const loading = useSelector(selectAdminLoading);
  const error = useSelector(selectAdminError);
  const pagination = useSelector(selectUserPagination);
  const activeUsers = useSelector(selectActiveUsers);
  const reports = useSelector(selectReports);
  const systemSettings = useSelector(selectSystemSettings);
  
  // Local state for UI
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  
  // RTK Query hooks
  const {
    data: usersData,
    isLoading: isLoadingUsers,
    isFetching: isFetchingUsers,
    error: usersQueryError,
    refetch: refetchUsers,
  } = useGetUsersQuery({
    ...filters,
    page: pagination.page,
    limit: pagination.limit,
  }, {
    skip: options.skipUsers,
    pollingInterval: options.pollingInterval,
  });
  
  const {
    data: reportsData,
    isLoading: isLoadingReports,
  } = useGetClinicReportsQuery({
    startDate: options.reportsStartDate,
    endDate: options.reportsEndDate,
    type: options.reportsType,
  }, {
    skip: options.skipReports,
  });
  
  const {
    data: settingsData,
    isLoading: isLoadingSettings,
  } = useGetSystemSettingsQuery(undefined, {
    skip: options.skipSettings,
  });
  
  // Mutations
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [toggleUserStatus, { isLoading: isTogglingStatus }] = useToggleUserStatusMutation();
  const [changeUserRole, { isLoading: isChangingRole }] = useChangeUserRoleMutation();
  const [resetUserPassword, { isLoading: isResettingPassword }] = useResetUserPasswordMutation();
  const [bulkUpdateUsers, { isLoading: isBulkUpdating }] = useBulkUpdateUsersMutation();
  const [bulkDeleteUsers, { isLoading: isBulkDeleting }] = useBulkDeleteUsersMutation();
  const [updateSystemSettings, { isLoading: isUpdatingSettings }] = useUpdateSystemSettingsMutation();
  
  // Actions
  const handleSelectUsers = useCallback((userIds) => {
    dispatch(setSelectedUsers(userIds));
  }, [dispatch]);
  
  const handleClearError = useCallback(() => {
    dispatch(clearUsersError());
  }, [dispatch]);
  
  const handleClearReportsError = useCallback(() => {
    dispatch(clearReportsError());
  }, [dispatch]);
  
  const handleClearSettingsError = useCallback(() => {
    dispatch(clearSettingsError());
  }, [dispatch]);
  
  // User operations
  const createNewUser = useCallback(async (userData) => {
    try {
      const result = await createUser(userData).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to create user' 
      };
    }
  }, [createUser]);
  
  const updateExistingUser = useCallback(async (id, userData) => {
    try {
      const result = await updateUser({ id, ...userData }).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to update user' 
      };
    }
  }, [updateUser]);
  
  const deleteExistingUser = useCallback(async (id) => {
    try {
      await deleteUser(id).unwrap();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to delete user' 
      };
    }
  }, [deleteUser]);
  
  const toggleUserActiveStatus = useCallback(async (id, status) => {
    try {
      const result = await toggleUserStatus({ id, status }).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to update user status' 
      };
    }
  }, [toggleUserStatus]);
  
  const updateUserRole = useCallback(async (id, role) => {
    try {
      const result = await changeUserRole({ id, role }).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to change user role' 
      };
    }
  }, [changeUserRole]);
  
  const resetPassword = useCallback(async (id, newPassword) => {
    try {
      const result = await resetUserPassword({ id, newPassword }).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to reset password' 
      };
    }
  }, [resetUserPassword]);
  
  const bulkUpdateSelectedUsers = useCallback(async (updateData) => {
    if (selectedUserIds.length === 0) {
      return { success: false, error: 'No users selected' };
    }
    
    try {
      const result = await bulkUpdateUsers({ userIds: selectedUserIds, updateData }).unwrap();
      setSelectedUserIds([]);
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to update users' 
      };
    }
  }, [bulkUpdateUsers, selectedUserIds]);
  
  const bulkDeleteSelectedUsers = useCallback(async () => {
    if (selectedUserIds.length === 0) {
      return { success: false, error: 'No users selected' };
    }
    
    try {
      await bulkDeleteUsers(selectedUserIds).unwrap();
      setSelectedUserIds([]);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to delete users' 
      };
    }
  }, [bulkDeleteUsers, selectedUserIds]);
  
  // System settings operations
  const updateSettings = useCallback(async (settings) => {
    try {
      const result = await updateSystemSettings(settings).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to update settings' 
      };
    }
  }, [updateSystemSettings]);
  
  // Selection management
  const handleSelectAll = useCallback(() => {
    if (selectedUserIds.length === users?.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(users?.map(u => u._id) || []);
    }
  }, [selectedUserIds.length, users]);
  
  const handleSelectUserId = useCallback((id) => {
    setSelectedUserIds(prev => 
      prev.includes(id) 
        ? prev.filter(uid => uid !== id)
        : [...prev, id]
    );
  }, []);
  
  const clearSelection = useCallback(() => {
    setSelectedUserIds([]);
  }, []);
  
  // Sorting
  const handleSort = useCallback((key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);
  
  // Get sorted users
  const getSortedUsers = useCallback(() => {
    if (!sortConfig.key || !users) return users || [];
    
    return [...users].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      
      // Handle special sorting for dates
      if (sortConfig.key === 'createdAt' || sortConfig.key === 'updatedAt' || sortConfig.key === 'lastLogin') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [users, sortConfig]);
  
  // Get user permissions
  const getUserPermissions = useCallback((user) => {
    const rolePermissions = {
      admin: ['all'],
      frontdesk: ['patients', 'appointments', 'queue'],
      doctor: ['appointments', 'queue', 'patients_read'],
    };
    
    return rolePermissions[user?.role] || [];
  }, []);
  
  // Check if user can perform action
  const canUserPerform = useCallback((user, action) => {
    const permissions = getUserPermissions(user);
    return permissions.includes('all') || permissions.includes(action);
  }, [getUserPermissions]);
  
  // Get user activity summary
  const getUserActivitySummary = useCallback(() => {
    return {
      totalUsers: userStats.total,
      activeUsers: userStats.active,
      newUsersThisMonth: users.filter(u => {
        const created = new Date(u.createdAt);
        const now = new Date();
        const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1);
        return created >= monthAgo;
      }).length,
      recentLogins: users.filter(u => {
        if (!u.lastLogin) return false;
        const lastLogin = new Date(u.lastLogin);
        const now = new Date();
        const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        return lastLogin >= dayAgo;
      }).length,
    };
  }, [userStats, users]);
  
  // Combined loading state
  const isLoading = loading || 
                   isLoadingUsers || 
                   isFetchingUsers || 
                   isLoadingReports || 
                   isLoadingSettings;
  
  // Combined error state
  const combinedError = error || usersQueryError?.data?.message;
  
  return {
    // State
    users: users || [],
    selectedUsers,
    loading: isLoadingUsers || loading,
    error: error,
    pagination,
    activeUsers,
    reports,
    systemSettings,
    
    // Selection
    selectedUserIds,
    hasSelection: selectedUserIds.length > 0,
    
    // Sorting
    sortConfig,
    
    // Loading states
    isCreating,
    isUpdating,
    isDeleting,
    isTogglingStatus,
    isChangingRole,
    isResettingPassword,
    isFetching: isFetchingUsers,
    
    // Actions
    handleSelectUsers,
    handleClearError,
    handleClearReportsError,
    handleClearSettingsError,
    refetch: refetchUsers,
    
    // User operations
    createUser: createNewUser,
    updateUser: updateExistingUser,
    deleteUser: deleteExistingUser,
    toggleUserStatus: toggleUserActiveStatus,
    changeUserRole: updateUserRole,
    resetUserPassword: resetPassword,
    bulkUpdateUsers: bulkUpdateSelectedUsers,
    bulkDeleteUsers: bulkDeleteSelectedUsers,
    
    // System operations
    updateSystemSettings: updateSettings,
    
    // Selection management
    handleSelectAll,
    handleSelectUserId,
    clearSelection,
    
    // Sorting
    handleSort,
    
    // Utilities
    getUserPermissions,
    canUserPerform,
    getUserActivitySummary,
  };
};

/**
 * Hook for single user operations
 */
export const useUser = (userId) => {
  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useGetUserQuery(userId, {
    skip: !userId,
  });
  
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [toggleUserStatus, { isLoading: isTogglingStatus }] = useToggleUserStatusMutation();
  const [changeUserRole, { isLoading: isChangingRole }] = useChangeUserRoleMutation();
  
  const updateCurrentUser = useCallback(async (userData) => {
    if (!userId) return { success: false, error: 'No user ID provided' };
    
    try {
      const result = await updateUser({ id: userId, ...userData }).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to update user' 
      };
    }
  }, [userId, updateUser]);
  
  const deleteCurrentUser = useCallback(async () => {
    if (!userId) return { success: false, error: 'No user ID provided' };
    
    try {
      await deleteUser(userId).unwrap();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to delete user' 
      };
    }
  }, [userId, deleteUser]);
  
  const toggleCurrentUserStatus = useCallback(async (status) => {
    if (!userId) return { success: false, error: 'No user ID provided' };
    
    try {
      const result = await toggleUserStatus({ id: userId, status }).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to update status' 
      };
    }
  }, [userId, toggleUserStatus]);
  
  const changeCurrentUserRole = useCallback(async (role) => {
    if (!userId) return { success: false, error: 'No user ID provided' };
    
    try {
      const result = await changeUserRole({ id: userId, role }).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to change role' 
      };
    }
  }, [userId, changeUserRole]);
  
  return {
    user,
    loading: isLoading,
    error: error?.data?.message,
    isUpdating,
    isDeleting,
    isTogglingStatus,
    isChangingRole,
    refetch,
    updateUser: updateCurrentUser,
    deleteUser: deleteCurrentUser,
    toggleStatus: toggleCurrentUserStatus,
    changeRole: changeCurrentUserRole,
  };
};