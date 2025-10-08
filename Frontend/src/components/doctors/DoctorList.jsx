import { useState } from 'react';
import { useDoctors } from '../../hooks/useDoctors';
import { SPECIALIZATIONS } from '../../utils/constants';
import LoadingSpinner, { TableLoader } from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import Modal from '../common/Modal';
import DoctorCard from './DoctorCard';
import DoctorFilters from './DoctorFilters';
import DoctorForm from './DoctorForm';

/**
 * DoctorList component with filtering and status display
 */
const DoctorList = () => {
  const {
    doctors,
    loading,
    error,
    filters,
    selectedDoctorIds,
    isAllSelected,
    hasSelection,
    isCreating,
    isUpdating,
    isDeleting,
    isTogglingStatus,
    handleFilterChange,
    handleSelectAll,
    handleSelectDoctorId,
    clearSelection,
    handleClearError,
    refetch,
    createDoctor,
    deleteDoctor,
    toggleDoctorStatus,
    getDoctorStats,
    getSpecializations,
  } = useDoctors();

  // View mode state
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Get statistics
  const stats = getDoctorStats();
  const availableSpecializations = getSpecializations();

  // Handle bulk operations
  const handleBulkStatusToggle = async (isActive) => {
    if (!hasSelection) return;
    
    // Implementation for bulk status toggle would go here
    clearSelection();
  };

  const handleBulkDelete = async () => {
    if (!hasSelection) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedDoctorIds.length} doctor(s)?`)) {
      // Implementation for bulk delete would go here
      clearSelection();
    }
  };

  // Handle add doctor
  const handleAddDoctor = () => {
    setShowAddModal(true);
  };

  // Handle doctor form submission
  const handleDoctorSubmit = async (doctorData) => {
    const result = await createDoctor(doctorData);
    if (result.success) {
      setShowAddModal(false);
      refetch(); // Refresh the doctor list
    }
    return result; // Return result to form for error handling
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Doctors</h1>
          <p className="mt-2 text-gray-600">
            Manage doctor profiles and availability
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary"
          >
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
          </button>
          <button onClick={handleAddDoctor} className="btn-primary">
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Doctor
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Doctors</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.total}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">On Duty</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.active}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Off Duty</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.inactive}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Specializations</dt>
                  <dd className="text-lg font-medium text-gray-900">{availableSpecializations.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <DoctorFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          specializations={availableSpecializations}
          onClear={() => handleFilterChange({ specialization: '', location: '', isActive: null })}
        />
      )}

      {/* Error Message */}
      {error && (
        <ErrorMessage
          message={error}
          type="error"
          dismissible
          onDismiss={handleClearError}
          onRetry={refetch}
        />
      )}

      {/* Bulk Actions */}
      {hasSelection && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800">
              {selectedDoctorIds.length} doctor(s) selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkStatusToggle(true)}
                disabled={isTogglingStatus}
                className="text-sm text-green-600 hover:text-green-800 font-medium"
              >
                Set On Duty
              </button>
              <button
                onClick={() => handleBulkStatusToggle(false)}
                disabled={isTogglingStatus}
                className="text-sm text-yellow-600 hover:text-yellow-800 font-medium"
              >
                Set Off Duty
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={isDeleting}
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                {isDeleting ? 'Deleting...' : 'Delete Selected'}
              </button>
              <button
                onClick={clearSelection}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results Info */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {doctors.length} doctor(s)
        </div>
        
        {hasSelection && (
          <button
            onClick={handleSelectAll}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            {isAllSelected ? 'Deselect All' : 'Select All'}
          </button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : doctors.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No doctors found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {Object.values(filters).some(Boolean)
              ? 'Try adjusting your filters'
              : 'Get started by adding a new doctor'}
          </p>
          {!Object.values(filters).some(Boolean) && (
            <div className="mt-6">
              <button onClick={handleAddDoctor} className="btn-primary">
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Doctor
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <DoctorCard
              key={doctor._id}
              doctor={doctor}
              selected={selectedDoctorIds.includes(doctor._id)}
              onSelect={() => handleSelectDoctorId(doctor._id)}
              onDelete={() => deleteDoctor(doctor._id)}
              onToggleStatus={(isActive) => toggleDoctorStatus(doctor._id, isActive)}
              isDeleting={isDeleting}
              isTogglingStatus={isTogglingStatus}
            />
          ))}
        </div>
      )}

      {/* Add Doctor Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Doctor"
        size="lg"
      >
        <DoctorForm
          onSubmit={handleDoctorSubmit}
          onCancel={() => setShowAddModal(false)}
          loading={isCreating}
        />
      </Modal>
    </div>
  );
};

export default DoctorList;