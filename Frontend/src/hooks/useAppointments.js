import { useSelector, useDispatch } from 'react-redux';
import { useState, useCallback } from 'react';
import {
  useGetAppointmentsQuery,
  useGetAppointmentQuery,
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
  useCancelAppointmentMutation,
  useCompleteAppointmentMutation,
  useDeleteAppointmentMutation,
  useRescheduleAppointmentMutation,
  useGetTodaysAppointmentsQuery,
  useGetUpcomingAppointmentsQuery,
  useLazyGetAvailableSlotsQuery,
  useLazyCheckAppointmentConflictQuery,
} from '../store/api/appointmentsApi';
import {
  selectAppointments,
  selectSelectedAppointment,
  selectAppointmentsLoading,
  selectAppointmentsError,
  selectAppointmentFilters,
  selectAppointmentPagination,
  selectFilteredAppointments,
  selectTodaysAppointments,
  selectUpcomingAppointments,
  selectAppointmentsByStatus,
  setAppointmentFilters,
  setSelectedAppointment,
  setAppointmentPagination,
  clearAppointmentsError,
} from '../store/slices/appointmentsSlice';

/**
 * Custom hook for appointment management
 * Provides appointment state and methods for CRUD operations
 */
export const useAppointments = (options = {}) => {
  const dispatch = useDispatch();
  
  // Redux state
  const appointments = useSelector(selectAppointments);
  const selectedAppointment = useSelector(selectSelectedAppointment);
  const loading = useSelector(selectAppointmentsLoading);
  const error = useSelector(selectAppointmentsError);
  const filters = useSelector(selectAppointmentFilters);
  const pagination = useSelector(selectAppointmentPagination);
  const filteredAppointments = useSelector(selectFilteredAppointments);
  const todaysAppointments = useSelector(selectTodaysAppointments);
  const upcomingAppointments = useSelector(selectUpcomingAppointments);
  const appointmentsByStatus = useSelector(selectAppointmentsByStatus);
  
  // Local state for UI
  const [selectedAppointmentIds, setSelectedAppointmentIds] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'asc' });
  
  // RTK Query hooks
  const {
    data: appointmentsData,
    isLoading: isLoadingAppointments,
    isFetching: isFetchingAppointments,
    error: appointmentsQueryError,
    refetch: refetchAppointments,
  } = useGetAppointmentsQuery({
    page: pagination.page,
    limit: pagination.limit,
    ...filters,
  }, {
    skip: options.skipQuery,
    pollingInterval: options.pollingInterval,
  });
  
  // Today's appointments
  const {
    data: todaysData,
    isLoading: isLoadingTodays,
  } = useGetTodaysAppointmentsQuery(filters.doctorId, {
    skip: options.skipTodays,
  });
  
  // Upcoming appointments
  const {
    data: upcomingData,
    isLoading: isLoadingUpcoming,
  } = useGetUpcomingAppointmentsQuery({
    limit: 5,
    doctorId: filters.doctorId,
    patientId: filters.patientId,
  }, {
    skip: options.skipUpcoming,
  });
  
  // Mutations
  const [createAppointment, { isLoading: isCreating }] = useCreateAppointmentMutation();
  const [updateAppointment, { isLoading: isUpdating }] = useUpdateAppointmentMutation();
  const [cancelAppointment, { isLoading: isCanceling }] = useCancelAppointmentMutation();
  const [completeAppointment, { isLoading: isCompleting }] = useCompleteAppointmentMutation();
  const [deleteAppointment, { isLoading: isDeleting }] = useDeleteAppointmentMutation();
  const [rescheduleAppointment, { isLoading: isRescheduling }] = useRescheduleAppointmentMutation();
  
  // Lazy queries
  const [getAvailableSlots, { data: availableSlots, isLoading: isLoadingSlots }] = useLazyGetAvailableSlotsQuery();
  const [checkConflict, { data: conflictData, isLoading: isCheckingConflict }] = useLazyCheckAppointmentConflictQuery();
  
  // Actions
  const handleFilterChange = useCallback((newFilters) => {
    dispatch(setAppointmentFilters(newFilters));
  }, [dispatch]);
  
  const handlePageChange = useCallback((page) => {
    dispatch(setAppointmentPagination({ page }));
  }, [dispatch]);
  
  const handlePageSizeChange = useCallback((limit) => {
    dispatch(setAppointmentPagination({ limit, page: 1 }));
  }, [dispatch]);
  
  const handleSelectAppointment = useCallback((appointment) => {
    dispatch(setSelectedAppointment(appointment));
  }, [dispatch]);
  
  const handleClearError = useCallback(() => {
    dispatch(clearAppointmentsError());
  }, [dispatch]);
  
  // CRUD operations
  const createNewAppointment = useCallback(async (appointmentData) => {
    try {
      const result = await createAppointment(appointmentData).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to create appointment' 
      };
    }
  }, [createAppointment]);
  
  const updateExistingAppointment = useCallback(async (id, appointmentData) => {
    try {
      const result = await updateAppointment({ id, ...appointmentData }).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to update appointment' 
      };
    }
  }, [updateAppointment]);
  
  const cancelExistingAppointment = useCallback(async (id, reason = '') => {
    try {
      const result = await cancelAppointment({ id, reason }).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to cancel appointment' 
      };
    }
  }, [cancelAppointment]);
  
  const completeExistingAppointment = useCallback(async (id, notes = '') => {
    try {
      const result = await completeAppointment({ id, notes }).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to complete appointment' 
      };
    }
  }, [completeAppointment]);
  
  const deleteExistingAppointment = useCallback(async (id) => {
    try {
      await deleteAppointment(id).unwrap();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to delete appointment' 
      };
    }
  }, [deleteAppointment]);
  
  const rescheduleExistingAppointment = useCallback(async (id, newDate, newTime, reason = '') => {
    try {
      const result = await rescheduleAppointment({ id, newDate, newTime, reason }).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to reschedule appointment' 
      };
    }
  }, [rescheduleAppointment]);
  
  // Availability and conflict checking
  const checkAvailableSlots = useCallback(async (doctorId, date) => {
    try {
      const result = await getAvailableSlots({ doctorId, date }).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to get available slots' 
      };
    }
  }, [getAvailableSlots]);
  
  const checkAppointmentConflict = useCallback(async (doctorId, date, time, excludeId = '') => {
    try {
      const result = await checkConflict({ doctorId, date, time, excludeId }).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to check conflict' 
      };
    }
  }, [checkConflict]);
  
  // Selection management
  const handleSelectAll = useCallback(() => {
    if (selectedAppointmentIds.length === filteredAppointments.length) {
      setSelectedAppointmentIds([]);
    } else {
      setSelectedAppointmentIds(filteredAppointments.map(a => a._id));
    }
  }, [selectedAppointmentIds.length, filteredAppointments]);
  
  const handleSelectAppointmentId = useCallback((id) => {
    setSelectedAppointmentIds(prev => 
      prev.includes(id) 
        ? prev.filter(aid => aid !== id)
        : [...prev, id]
    );
  }, []);
  
  const clearSelection = useCallback(() => {
    setSelectedAppointmentIds([]);
  }, []);
  
  // Sorting
  const handleSort = useCallback((key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);
  
  // Get sorted appointments
  const getSortedAppointments = useCallback(() => {
    if (!sortConfig.key) return filteredAppointments;
    
    return [...filteredAppointments].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      
      // Handle date/time sorting
      if (sortConfig.key === 'date' || sortConfig.key === 'time') {
        aValue = new Date(`${a.date} ${a.time}`);
        bValue = new Date(`${b.date} ${b.time}`);
      }
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredAppointments, sortConfig]);
  
  // Statistics
  const getAppointmentStats = useCallback(() => {
    const stats = {
      total: appointments.length,
      booked: 0,
      completed: 0,
      canceled: 0,
      today: todaysAppointments.length,
      upcoming: upcomingAppointments.length,
    };
    
    appointments.forEach(appointment => {
      switch (appointment.status) {
        case 'Booked':
          stats.booked++;
          break;
        case 'Completed':
          stats.completed++;
          break;
        case 'Canceled':
          stats.canceled++;
          break;
      }
    });
    
    return stats;
  }, [appointments, todaysAppointments, upcomingAppointments]);
  
  // Combined loading state
  const isLoading = loading || isLoadingAppointments || isFetchingAppointments;
  
  // Combined error state
  const combinedError = error || appointmentsQueryError?.data?.message;
  
  return {
    // State
    appointments: getSortedAppointments(),
    allAppointments: appointments,
    selectedAppointment,
    loading: isLoading,
    error: combinedError,
    filters,
    pagination,
    todaysAppointments,
    upcomingAppointments,
    appointmentsByStatus,
    availableSlots,
    conflictData,
    
    // Selection
    selectedAppointmentIds,
    isAllSelected: selectedAppointmentIds.length === filteredAppointments.length && filteredAppointments.length > 0,
    hasSelection: selectedAppointmentIds.length > 0,
    
    // Sorting
    sortConfig,
    
    // Loading states
    isCreating,
    isUpdating,
    isCanceling,
    isCompleting,
    isDeleting,
    isRescheduling,
    isLoadingSlots,
    isCheckingConflict,
    isLoadingTodays,
    isLoadingUpcoming,
    isFetching: isFetchingAppointments,
    
    // Actions
    handleFilterChange,
    handlePageChange,
    handlePageSizeChange,
    handleSelectAppointment,
    handleClearError,
    refetch: refetchAppointments,
    
    // CRUD operations
    createAppointment: createNewAppointment,
    updateAppointment: updateExistingAppointment,
    cancelAppointment: cancelExistingAppointment,
    completeAppointment: completeExistingAppointment,
    deleteAppointment: deleteExistingAppointment,
    rescheduleAppointment: rescheduleExistingAppointment,
    
    // Availability and conflicts
    checkAvailableSlots,
    checkAppointmentConflict,
    
    // Selection management
    handleSelectAll,
    handleSelectAppointmentId,
    clearSelection,
    
    // Sorting
    handleSort,
    
    // Utilities
    getAppointmentStats,
  };
};

/**
 * Hook for single appointment operations
 */
export const useAppointment = (appointmentId) => {
  const {
    data: appointment,
    isLoading,
    error,
    refetch,
  } = useGetAppointmentQuery(appointmentId, {
    skip: !appointmentId,
  });
  
  const [updateAppointment, { isLoading: isUpdating }] = useUpdateAppointmentMutation();
  const [cancelAppointment, { isLoading: isCanceling }] = useCancelAppointmentMutation();
  const [completeAppointment, { isLoading: isCompleting }] = useCompleteAppointmentMutation();
  const [deleteAppointment, { isLoading: isDeleting }] = useDeleteAppointmentMutation();
  
  const updateCurrentAppointment = useCallback(async (appointmentData) => {
    if (!appointmentId) return { success: false, error: 'No appointment ID provided' };
    
    try {
      const result = await updateAppointment({ id: appointmentId, ...appointmentData }).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to update appointment' 
      };
    }
  }, [appointmentId, updateAppointment]);
  
  const cancelCurrentAppointment = useCallback(async (reason = '') => {
    if (!appointmentId) return { success: false, error: 'No appointment ID provided' };
    
    try {
      const result = await cancelAppointment({ id: appointmentId, reason }).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to cancel appointment' 
      };
    }
  }, [appointmentId, cancelAppointment]);
  
  const completeCurrentAppointment = useCallback(async (notes = '') => {
    if (!appointmentId) return { success: false, error: 'No appointment ID provided' };
    
    try {
      const result = await completeAppointment({ id: appointmentId, notes }).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to complete appointment' 
      };
    }
  }, [appointmentId, completeAppointment]);
  
  const deleteCurrentAppointment = useCallback(async () => {
    if (!appointmentId) return { success: false, error: 'No appointment ID provided' };
    
    try {
      await deleteAppointment(appointmentId).unwrap();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to delete appointment' 
      };
    }
  }, [appointmentId, deleteAppointment]);
  
  return {
    appointment,
    loading: isLoading,
    error: error?.data?.message,
    isUpdating,
    isCanceling,
    isCompleting,
    isDeleting,
    refetch,
    updateAppointment: updateCurrentAppointment,
    cancelAppointment: cancelCurrentAppointment,
    completeAppointment: completeCurrentAppointment,
    deleteAppointment: deleteCurrentAppointment,
  };
};