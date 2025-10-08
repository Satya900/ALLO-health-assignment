import { useSelector, useDispatch } from 'react-redux';
import { useState, useCallback } from 'react';
import {
  useGetPatientsQuery,
  useGetPatientQuery,
  useCreatePatientMutation,
  useUpdatePatientMutation,
  useDeletePatientMutation,
  useSearchPatientsQuery,
  useLazySearchPatientsQuery,
} from '../store/api/patientsApi';
import {
  selectPatients,
  selectSelectedPatient,
  selectPatientsLoading,
  selectPatientsError,
  selectPatientsSearchQuery,
  selectPatientsFilters,
  selectPatientsPagination,
  selectFilteredPatients,
  setSearchQuery,
  setFilters,
  setPagination,
  setSelectedPatient,
  clearPatientsError,
} from '../store/slices/patientsSlice';

/**
 * Custom hook for patient management
 * Provides patient state and methods for CRUD operations
 */
export const usePatients = (options = {}) => {
  const dispatch = useDispatch();
  
  // Redux state
  const patients = useSelector(selectPatients);
  const selectedPatient = useSelector(selectSelectedPatient);
  const loading = useSelector(selectPatientsLoading);
  const error = useSelector(selectPatientsError);
  const searchQuery = useSelector(selectPatientsSearchQuery);
  const filters = useSelector(selectPatientsFilters);
  const pagination = useSelector(selectPatientsPagination);
  const filteredPatients = useSelector(selectFilteredPatients);
  
  // Local state for UI
  const [selectedPatientIds, setSelectedPatientIds] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  
  // RTK Query hooks
  const {
    data: patientsData,
    isLoading: isLoadingPatients,
    isFetching: isFetchingPatients,
    error: patientsQueryError,
    refetch: refetchPatients,
  } = useGetPatientsQuery({
    page: pagination.page,
    limit: pagination.limit,
    search: searchQuery,
    ...filters,
  }, {
    skip: options.skipQuery,
    pollingInterval: options.pollingInterval,
  });
  
  // Mutations
  const [createPatient, { isLoading: isCreating }] = useCreatePatientMutation();
  const [updatePatient, { isLoading: isUpdating }] = useUpdatePatientMutation();
  const [deletePatient, { isLoading: isDeleting }] = useDeletePatientMutation();
  
  // Search
  const [searchPatients, { data: searchResults, isLoading: isSearching }] = useLazySearchPatientsQuery();
  
  // Actions
  const handleSearch = useCallback((query) => {
    dispatch(setSearchQuery(query));
    if (query.trim()) {
      searchPatients(query);
    }
  }, [dispatch, searchPatients]);
  
  const handleFilterChange = useCallback((newFilters) => {
    dispatch(setFilters(newFilters));
  }, [dispatch]);
  
  const handlePageChange = useCallback((page) => {
    dispatch(setPagination({ page }));
  }, [dispatch]);
  
  const handlePageSizeChange = useCallback((limit) => {
    dispatch(setPagination({ limit, page: 1 }));
  }, [dispatch]);
  
  const handleSelectPatient = useCallback((patient) => {
    dispatch(setSelectedPatient(patient));
  }, [dispatch]);
  
  const handleClearError = useCallback(() => {
    dispatch(clearPatientsError());
  }, [dispatch]);
  
  // CRUD operations
  const createNewPatient = useCallback(async (patientData) => {
    try {
      const result = await createPatient(patientData).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to create patient' 
      };
    }
  }, [createPatient]);
  
  const updateExistingPatient = useCallback(async (id, patientData) => {
    try {
      const result = await updatePatient({ id, ...patientData }).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to update patient' 
      };
    }
  }, [updatePatient]);
  
  const deleteExistingPatient = useCallback(async (id) => {
    try {
      await deletePatient(id).unwrap();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to delete patient' 
      };
    }
  }, [deletePatient]);
  
  // Selection management
  const handleSelectAll = useCallback(() => {
    if (selectedPatientIds.length === filteredPatients.length) {
      setSelectedPatientIds([]);
    } else {
      setSelectedPatientIds(filteredPatients.map(p => p._id));
    }
  }, [selectedPatientIds.length, filteredPatients]);
  
  const handleSelectPatientId = useCallback((id) => {
    setSelectedPatientIds(prev => 
      prev.includes(id) 
        ? prev.filter(pid => pid !== id)
        : [...prev, id]
    );
  }, []);
  
  const clearSelection = useCallback(() => {
    setSelectedPatientIds([]);
  }, []);
  
  // Sorting
  const handleSort = useCallback((key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);
  
  // Get sorted patients
  const getSortedPatients = useCallback(() => {
    if (!sortConfig.key) return filteredPatients;
    
    return [...filteredPatients].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredPatients, sortConfig]);
  
  // Statistics
  const getPatientStats = useCallback(() => {
    const stats = {
      total: patients.length,
      male: patients.filter(p => p.gender === 'Male').length,
      female: patients.filter(p => p.gender === 'Female').length,
      children: patients.filter(p => p.age < 18).length,
      adults: patients.filter(p => p.age >= 18 && p.age < 65).length,
      seniors: patients.filter(p => p.age >= 65).length,
    };
    
    return stats;
  }, [patients]);
  
  // Combined loading state
  const isLoading = loading || isLoadingPatients || isFetchingPatients;
  
  // Combined error state
  const combinedError = error || patientsQueryError?.data?.message;
  
  return {
    // State
    patients: getSortedPatients(),
    allPatients: patients,
    selectedPatient,
    loading: isLoading,
    error: combinedError,
    searchQuery,
    filters,
    pagination,
    searchResults,
    
    // Selection
    selectedPatientIds,
    isAllSelected: selectedPatientIds.length === filteredPatients.length && filteredPatients.length > 0,
    hasSelection: selectedPatientIds.length > 0,
    
    // Sorting
    sortConfig,
    
    // Loading states
    isCreating,
    isUpdating,
    isDeleting,
    isSearching,
    isFetching: isFetchingPatients,
    
    // Actions
    handleSearch,
    handleFilterChange,
    handlePageChange,
    handlePageSizeChange,
    handleSelectPatient,
    handleClearError,
    refetch: refetchPatients,
    
    // CRUD operations
    createPatient: createNewPatient,
    updatePatient: updateExistingPatient,
    deletePatient: deleteExistingPatient,
    
    // Selection management
    handleSelectAll,
    handleSelectPatientId,
    clearSelection,
    
    // Sorting
    handleSort,
    
    // Utilities
    getPatientStats,
  };
};

/**
 * Hook for single patient operations
 */
export const usePatient = (patientId) => {
  const {
    data: patient,
    isLoading,
    error,
    refetch,
  } = useGetPatientQuery(patientId, {
    skip: !patientId,
  });
  
  const [updatePatient, { isLoading: isUpdating }] = useUpdatePatientMutation();
  const [deletePatient, { isLoading: isDeleting }] = useDeletePatientMutation();
  
  const updateCurrentPatient = useCallback(async (patientData) => {
    if (!patientId) return { success: false, error: 'No patient ID provided' };
    
    try {
      const result = await updatePatient({ id: patientId, ...patientData }).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to update patient' 
      };
    }
  }, [patientId, updatePatient]);
  
  const deleteCurrentPatient = useCallback(async () => {
    if (!patientId) return { success: false, error: 'No patient ID provided' };
    
    try {
      await deletePatient(patientId).unwrap();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to delete patient' 
      };
    }
  }, [patientId, deletePatient]);
  
  return {
    patient,
    loading: isLoading,
    error: error?.data?.message,
    isUpdating,
    isDeleting,
    refetch,
    updatePatient: updateCurrentPatient,
    deletePatient: deleteCurrentPatient,
  };
};