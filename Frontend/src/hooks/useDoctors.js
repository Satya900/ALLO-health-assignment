import { useSelector, useDispatch } from 'react-redux';
import { useState, useCallback } from 'react';
import {
  useGetDoctorsQuery,
  useGetDoctorQuery,
  useCreateDoctorMutation,
  useUpdateDoctorMutation,
  useDeleteDoctorMutation,
  useToggleDoctorStatusMutation,
  useSearchDoctorsQuery,
  useLazySearchDoctorsQuery,
} from '../store/api/doctorsApi';
import {
  selectDoctors,
  selectSelectedDoctor,
  selectDoctorsLoading,
  selectDoctorsError,
  selectDoctorFilters,
  selectFilteredDoctors,
  selectActiveDoctors,
  selectDoctorsBySpecialization,
  setDoctorFilters,
  setSelectedDoctor,
  clearDoctorsError,
} from '../store/slices/doctorsSlice';

/**
 * Custom hook for doctor management
 * Provides doctor state and methods for CRUD operations
 */
export const useDoctors = (options = {}) => {
  const dispatch = useDispatch();
  
  // Redux state
  const doctors = useSelector(selectDoctors);
  const selectedDoctor = useSelector(selectSelectedDoctor);
  const loading = useSelector(selectDoctorsLoading);
  const error = useSelector(selectDoctorsError);
  const filters = useSelector(selectDoctorFilters);
  const filteredDoctors = useSelector(selectFilteredDoctors);
  const activeDoctors = useSelector(selectActiveDoctors);
  const doctorsBySpecialization = useSelector(selectDoctorsBySpecialization);
  
  // Local state for UI
  const [selectedDoctorIds, setSelectedDoctorIds] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  
  // RTK Query hooks
  const {
    data: doctorsData,
    isLoading: isLoadingDoctors,
    isFetching: isFetchingDoctors,
    error: doctorsQueryError,
    refetch: refetchDoctors,
  } = useGetDoctorsQuery({
    ...filters,
  }, {
    skip: options.skipQuery,
    pollingInterval: options.pollingInterval,
  });
  
  // Mutations
  const [createDoctor, { isLoading: isCreating }] = useCreateDoctorMutation();
  const [updateDoctor, { isLoading: isUpdating }] = useUpdateDoctorMutation();
  const [deleteDoctor, { isLoading: isDeleting }] = useDeleteDoctorMutation();
  const [toggleStatus, { isLoading: isTogglingStatus }] = useToggleDoctorStatusMutation();
  
  // Search
  const [searchDoctors, { data: searchResults, isLoading: isSearching }] = useLazySearchDoctorsQuery();
  
  // Actions
  const handleFilterChange = useCallback((newFilters) => {
    dispatch(setDoctorFilters(newFilters));
  }, [dispatch]);
  
  const handleSelectDoctor = useCallback((doctor) => {
    dispatch(setSelectedDoctor(doctor));
  }, [dispatch]);
  
  const handleClearError = useCallback(() => {
    dispatch(clearDoctorsError());
  }, [dispatch]);
  
  // CRUD operations
  const createNewDoctor = useCallback(async (doctorData) => {
    try {
      const result = await createDoctor(doctorData).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to create doctor' 
      };
    }
  }, [createDoctor]);
  
  const updateExistingDoctor = useCallback(async (id, doctorData) => {
    try {
      const result = await updateDoctor({ id, ...doctorData }).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to update doctor' 
      };
    }
  }, [updateDoctor]);
  
  const deleteExistingDoctor = useCallback(async (id) => {
    try {
      await deleteDoctor(id).unwrap();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to delete doctor' 
      };
    }
  }, [deleteDoctor]);
  
  const toggleDoctorStatus = useCallback(async (doctorId, isActive) => {
    try {
      const result = await toggleStatus({ doctorId, isActive }).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to update doctor status' 
      };
    }
  }, [toggleStatus]);
  
  // Search functionality
  const handleSearch = useCallback((query) => {
    if (query.trim()) {
      searchDoctors(query);
    }
  }, [searchDoctors]);
  
  // Selection management
  const handleSelectAll = useCallback(() => {
    if (selectedDoctorIds.length === filteredDoctors.length) {
      setSelectedDoctorIds([]);
    } else {
      setSelectedDoctorIds(filteredDoctors.map(d => d._id));
    }
  }, [selectedDoctorIds.length, filteredDoctors]);
  
  const handleSelectDoctorId = useCallback((id) => {
    setSelectedDoctorIds(prev => 
      prev.includes(id) 
        ? prev.filter(did => did !== id)
        : [...prev, id]
    );
  }, []);
  
  const clearSelection = useCallback(() => {
    setSelectedDoctorIds([]);
  }, []);
  
  // Sorting
  const handleSort = useCallback((key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);
  
  // Get sorted doctors
  const getSortedDoctors = useCallback(() => {
    if (!sortConfig.key) return filteredDoctors;
    
    return [...filteredDoctors].sort((a, b) => {
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
  }, [filteredDoctors, sortConfig]);
  
  // Statistics
  const getDoctorStats = useCallback(() => {
    const stats = {
      total: doctors.length,
      active: doctors.filter(d => d.isActive).length,
      inactive: doctors.filter(d => !d.isActive).length,
      specializations: {},
    };
    
    // Count by specialization
    doctors.forEach(doctor => {
      if (doctor.specialization) {
        stats.specializations[doctor.specialization] = 
          (stats.specializations[doctor.specialization] || 0) + 1;
      }
    });
    
    return stats;
  }, [doctors]);
  
  // Get doctors by specialization
  const getDoctorsBySpec = useCallback((specialization) => {
    return doctors.filter(doctor => doctor.specialization === specialization);
  }, [doctors]);
  
  // Get available specializations
  const getSpecializations = useCallback(() => {
    const specializations = [...new Set(doctors.map(d => d.specialization).filter(Boolean))];
    return specializations.sort();
  }, [doctors]);
  
  // Combined loading state
  const isLoading = loading || isLoadingDoctors || isFetchingDoctors;
  
  // Combined error state
  const combinedError = error || doctorsQueryError?.data?.message;
  
  return {
    // State
    doctors: getSortedDoctors(),
    allDoctors: doctors,
    selectedDoctor,
    loading: isLoading,
    error: combinedError,
    filters,
    searchResults,
    activeDoctors,
    doctorsBySpecialization,
    
    // Selection
    selectedDoctorIds,
    isAllSelected: selectedDoctorIds.length === filteredDoctors.length && filteredDoctors.length > 0,
    hasSelection: selectedDoctorIds.length > 0,
    
    // Sorting
    sortConfig,
    
    // Loading states
    isCreating,
    isUpdating,
    isDeleting,
    isTogglingStatus,
    isSearching,
    isFetching: isFetchingDoctors,
    
    // Actions
    handleFilterChange,
    handleSelectDoctor,
    handleClearError,
    handleSearch,
    refetch: refetchDoctors,
    
    // CRUD operations
    createDoctor: createNewDoctor,
    updateDoctor: updateExistingDoctor,
    deleteDoctor: deleteExistingDoctor,
    toggleDoctorStatus,
    
    // Selection management
    handleSelectAll,
    handleSelectDoctorId,
    clearSelection,
    
    // Sorting
    handleSort,
    
    // Utilities
    getDoctorStats,
    getDoctorsBySpec,
    getSpecializations,
  };
};

/**
 * Hook for single doctor operations
 */
export const useDoctor = (doctorId) => {
  const {
    data: doctor,
    isLoading,
    error,
    refetch,
  } = useGetDoctorQuery(doctorId, {
    skip: !doctorId,
  });
  
  const [updateDoctor, { isLoading: isUpdating }] = useUpdateDoctorMutation();
  const [deleteDoctor, { isLoading: isDeleting }] = useDeleteDoctorMutation();
  const [toggleStatus, { isLoading: isTogglingStatus }] = useToggleDoctorStatusMutation();
  
  const updateCurrentDoctor = useCallback(async (doctorData) => {
    if (!doctorId) return { success: false, error: 'No doctor ID provided' };
    
    try {
      const result = await updateDoctor({ id: doctorId, ...doctorData }).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to update doctor' 
      };
    }
  }, [doctorId, updateDoctor]);
  
  const deleteCurrentDoctor = useCallback(async () => {
    if (!doctorId) return { success: false, error: 'No doctor ID provided' };
    
    try {
      await deleteDoctor(doctorId).unwrap();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to delete doctor' 
      };
    }
  }, [doctorId, deleteDoctor]);
  
  const toggleCurrentDoctorStatus = useCallback(async (isActive) => {
    if (!doctorId) return { success: false, error: 'No doctor ID provided' };
    
    try {
      const result = await toggleStatus({ doctorId, isActive }).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to update doctor status' 
      };
    }
  }, [doctorId, toggleStatus]);
  
  return {
    doctor,
    loading: isLoading,
    error: error?.data?.message,
    isUpdating,
    isDeleting,
    isTogglingStatus,
    refetch,
    updateDoctor: updateCurrentDoctor,
    deleteDoctor: deleteCurrentDoctor,
    toggleStatus: toggleCurrentDoctorStatus,
  };
};