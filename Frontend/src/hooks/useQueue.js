import { useSelector, useDispatch } from 'react-redux';
import { useState, useCallback } from 'react';
import {
  useGetQueueQuery,
  useGetQueueItemQuery,
  useAddToQueueMutation,
  useUpdateQueueItemMutation,
  useUpdateQueueStatusMutation,
  useUpdateQueuePriorityMutation,
  useRemoveFromQueueMutation,
  useReorderQueueMutation,
  useGetQueueByDoctorQuery,
  useGetTodaysQueueQuery,
  useGetQueueStatsQuery,
  useCallNextPatientMutation,
  useAddAppointmentToQueueMutation,
} from '../store/api/queueApi';
import { QUEUE_STATUS, QUEUE_PRIORITY } from '../utils/constants';
import {
  selectQueues,
  selectSelectedQueue,
  selectQueueLoading,
  selectQueueError,
  selectQueueFilters,
  selectFilteredQueues,
  selectQueueByDoctor,
  selectActiveQueue,
  selectWaitingQueue,
  selectQueueStats,
  setQueueFilters,
  setSelectedQueue,
  clearQueueError,
} from '../store/slices/queueSlice';

/**
 * Custom hook for queue management
 * Provides queue state and methods for queue operations
 */
export const useQueue = (options = {}) => {
  const dispatch = useDispatch();
  
  // Redux state
  const queues = useSelector(selectQueues);
  const selectedQueue = useSelector(selectSelectedQueue);
  const loading = useSelector(selectQueueLoading);
  const error = useSelector(selectQueueError);
  const filters = useSelector(selectQueueFilters);
  const filteredQueues = useSelector(selectFilteredQueues);
  const queueByDoctor = useSelector(selectQueueByDoctor);
  const activeQueue = useSelector(selectActiveQueue);
  const waitingQueue = useSelector(selectWaitingQueue);
  const queueStats = useSelector(selectQueueStats);
  
  // Local state for UI
  const [selectedQueueIds, setSelectedQueueIds] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'queueNumber', direction: 'asc' });
  
  // RTK Query hooks
  const {
    data: queueData,
    isLoading: isLoadingQueue,
    isFetching: isFetchingQueue,
    error: queueQueryError,
    refetch: refetchQueue,
  } = useGetQueueQuery({
    ...filters,
  }, {
    skip: options.skipQuery,
    pollingInterval: options.pollingInterval || 30000, // Poll every 30 seconds for real-time updates
  });
  
  // Today's queue
  const {
    data: todaysQueueData,
    isLoading: isLoadingTodays,
  } = useGetTodaysQueueQuery(filters.doctorId, {
    skip: options.skipTodays,
  });
  
  // Queue statistics
  const {
    data: statsData,
    isLoading: isLoadingStats,
  } = useGetQueueStatsQuery({
    doctorId: filters.doctorId,
    date: new Date().toISOString().split('T')[0],
  }, {
    skip: options.skipStats,
  });
  
  // Mutations
  const [addToQueue, { isLoading: isAdding }] = useAddToQueueMutation();
  const [updateQueueItem, { isLoading: isUpdating }] = useUpdateQueueItemMutation();
  const [updateQueueStatus, { isLoading: isUpdatingStatus }] = useUpdateQueueStatusMutation();
  const [updateQueuePriority, { isLoading: isUpdatingPriority }] = useUpdateQueuePriorityMutation();
  const [removeFromQueue, { isLoading: isRemoving }] = useRemoveFromQueueMutation();
  const [reorderQueue, { isLoading: isReordering }] = useReorderQueueMutation();
  const [callNextPatient, { isLoading: isCalling }] = useCallNextPatientMutation();
  const [addAppointmentToQueue, { isLoading: isAddingAppointment }] = useAddAppointmentToQueueMutation();
  
  // Actions
  const handleFilterChange = useCallback((newFilters) => {
    dispatch(setQueueFilters(newFilters));
  }, [dispatch]);
  
  const handleSelectQueue = useCallback((queueItem) => {
    dispatch(setSelectedQueue(queueItem));
  }, [dispatch]);
  
  const handleClearError = useCallback(() => {
    dispatch(clearQueueError());
  }, [dispatch]);
  
  // Queue operations
  const addPatientToQueue = useCallback(async (queueData) => {
    try {
      const result = await addToQueue(queueData).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to add patient to queue' 
      };
    }
  }, [addToQueue]);
  
  const updateExistingQueueItem = useCallback(async (id, queueData) => {
    try {
      const result = await updateQueueItem({ id, ...queueData }).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to update queue item' 
      };
    }
  }, [updateQueueItem]);
  
  const updatePatientStatus = useCallback(async (id, status, notes = '') => {
    try {
      const result = await updateQueueStatus({ id, status, notes }).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to update patient status' 
      };
    }
  }, [updateQueueStatus]);
  
  const updatePatientPriority = useCallback(async (id, priority) => {
    try {
      const result = await updateQueuePriority({ id, priority }).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to update patient priority' 
      };
    }
  }, [updateQueuePriority]);
  
  const removePatientFromQueue = useCallback(async (id) => {
    try {
      await removeFromQueue(id).unwrap();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to remove patient from queue' 
      };
    }
  }, [removeFromQueue]);
  
  const reorderPatients = useCallback(async (doctorId, queueOrder) => {
    try {
      const result = await reorderQueue({ doctorId, queueOrder }).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to reorder queue' 
      };
    }
  }, [reorderQueue]);
  
  const callNext = useCallback(async (doctorId) => {
    try {
      const result = await callNextPatient(doctorId).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to call next patient' 
      };
    }
  }, [callNextPatient]);
  
  const addAppointmentToQueueList = useCallback(async (appointmentId, priority = 'Normal') => {
    try {
      const result = await addAppointmentToQueue({ appointmentId, priority }).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to add appointment to queue' 
      };
    }
  }, [addAppointmentToQueue]);
  
  // Selection management
  const handleSelectAll = useCallback(() => {
    if (selectedQueueIds.length === filteredQueues.length) {
      setSelectedQueueIds([]);
    } else {
      setSelectedQueueIds(filteredQueues.map(q => q._id));
    }
  }, [selectedQueueIds.length, filteredQueues]);
  
  const handleSelectQueueId = useCallback((id) => {
    setSelectedQueueIds(prev => 
      prev.includes(id) 
        ? prev.filter(qid => qid !== id)
        : [...prev, id]
    );
  }, []);
  
  const clearSelection = useCallback(() => {
    setSelectedQueueIds([]);
  }, []);
  
  // Sorting
  const handleSort = useCallback((key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);
  
  // Get sorted queue
  const getSortedQueue = useCallback(() => {
    if (!sortConfig.key) return filteredQueues;
    
    return [...filteredQueues].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      
      // Handle special sorting for queue number and time
      if (sortConfig.key === 'queueNumber') {
        aValue = parseInt(aValue, 10) || 0;
        bValue = parseInt(bValue, 10) || 0;
      } else if (sortConfig.key === 'createdAt' || sortConfig.key === 'updatedAt') {
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
  }, [filteredQueues, sortConfig]);
  
  // Get queue by doctor
  const getQueueByDoctorId = useCallback((doctorId) => {
    return queues.filter(q => {
      // Handle both doctorId field and populated doctor object
      const queueDoctorId = q.doctorId || q.doctor?._id || q.doctor;
      return queueDoctorId === doctorId;
    });
  }, [queues]);
  
  // Get next patient for doctor
  const getNextPatientForDoctor = useCallback((doctorId) => {
    const doctorQueue = getQueueByDoctorId(doctorId)
      .filter(q => q.status === QUEUE_STATUS.WAITING)
      .sort((a, b) => {
        // Sort by priority first (Urgent before Normal), then by queue number
        if (a.priority !== b.priority) {
          return a.priority === QUEUE_PRIORITY.URGENT ? -1 : 1;
        }
        return (parseInt(a.queueNumber, 10) || 0) - (parseInt(b.queueNumber, 10) || 0);
      });
    
    return doctorQueue[0] || null;
  }, [getQueueByDoctorId]);
  
  // Get queue statistics
  const getQueueStatistics = useCallback(() => {
    const stats = {
      total: queues.length,
      waiting: queues.filter(q => q.status === QUEUE_STATUS.WAITING).length,
      withDoctor: queues.filter(q => q.status === QUEUE_STATUS.WITH_DOCTOR).length,
      completed: queues.filter(q => q.status === QUEUE_STATUS.COMPLETED).length,
      urgent: queues.filter(q => q.priority === QUEUE_PRIORITY.URGENT).length,
      averageWaitTime: 0, // Would be calculated from actual wait times
    };
    
    return stats;
  }, [queues]);
  
  // Combined loading state
  const isLoading = loading || isLoadingQueue || isFetchingQueue;
  
  // Combined error state
  const combinedError = error || queueQueryError?.data?.message;
  
  return {
    // State
    queue: getSortedQueue(),
    allQueues: queues,
    selectedQueue,
    loading: isLoading,
    error: combinedError,
    filters,
    queueByDoctor,
    activeQueue,
    waitingQueue,
    queueStats: getQueueStatistics(),
    todaysQueue: todaysQueueData?.queue || [],
    
    // Selection
    selectedQueueIds,
    isAllSelected: selectedQueueIds.length === filteredQueues.length && filteredQueues.length > 0,
    hasSelection: selectedQueueIds.length > 0,
    
    // Sorting
    sortConfig,
    
    // Loading states
    isAdding,
    isUpdating,
    isUpdatingStatus,
    isUpdatingPriority,
    isRemoving,
    isReordering,
    isCalling,
    isAddingAppointment,
    isLoadingTodays,
    isLoadingStats,
    isFetching: isFetchingQueue,
    
    // Actions
    handleFilterChange,
    handleSelectQueue,
    handleClearError,
    refetch: refetchQueue,
    
    // Queue operations
    addPatientToQueue,
    updateQueueItem: updateExistingQueueItem,
    updatePatientStatus,
    updatePatientPriority,
    removePatientFromQueue,
    reorderPatients,
    callNext,
    addAppointmentToQueue: addAppointmentToQueueList,
    
    // Selection management
    handleSelectAll,
    handleSelectQueueId,
    clearSelection,
    
    // Sorting
    handleSort,
    
    // Utilities
    getQueueByDoctorId,
    getNextPatientForDoctor,
    getQueueStatistics,
  };
};

/**
 * Hook for single queue item operations
 */
export const useQueueItem = (queueItemId) => {
  const {
    data: queueItem,
    isLoading,
    error,
    refetch,
  } = useGetQueueItemQuery(queueItemId, {
    skip: !queueItemId,
  });
  
  const [updateQueueItem, { isLoading: isUpdating }] = useUpdateQueueItemMutation();
  const [updateQueueStatus, { isLoading: isUpdatingStatus }] = useUpdateQueueStatusMutation();
  const [updateQueuePriority, { isLoading: isUpdatingPriority }] = useUpdateQueuePriorityMutation();
  const [removeFromQueue, { isLoading: isRemoving }] = useRemoveFromQueueMutation();
  
  const updateCurrentQueueItem = useCallback(async (queueData) => {
    if (!queueItemId) return { success: false, error: 'No queue item ID provided' };
    
    try {
      const result = await updateQueueItem({ id: queueItemId, ...queueData }).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to update queue item' 
      };
    }
  }, [queueItemId, updateQueueItem]);
  
  const updateCurrentStatus = useCallback(async (status, notes = '') => {
    if (!queueItemId) return { success: false, error: 'No queue item ID provided' };
    
    try {
      const result = await updateQueueStatus({ id: queueItemId, status, notes }).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to update status' 
      };
    }
  }, [queueItemId, updateQueueStatus]);
  
  const updateCurrentPriority = useCallback(async (priority) => {
    if (!queueItemId) return { success: false, error: 'No queue item ID provided' };
    
    try {
      const result = await updateQueuePriority({ id: queueItemId, priority }).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to update priority' 
      };
    }
  }, [queueItemId, updateQueuePriority]);
  
  const removeCurrentFromQueue = useCallback(async () => {
    if (!queueItemId) return { success: false, error: 'No queue item ID provided' };
    
    try {
      await removeFromQueue(queueItemId).unwrap();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to remove from queue' 
      };
    }
  }, [queueItemId, removeFromQueue]);
  
  return {
    queueItem,
    loading: isLoading,
    error: error?.data?.message,
    isUpdating,
    isUpdatingStatus,
    isUpdatingPriority,
    isRemoving,
    refetch,
    updateQueueItem: updateCurrentQueueItem,
    updateStatus: updateCurrentStatus,
    updatePriority: updateCurrentPriority,
    removeFromQueue: removeCurrentFromQueue,
  };
};