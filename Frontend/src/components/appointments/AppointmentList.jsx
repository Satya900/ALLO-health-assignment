import { useState } from 'react';
import { useAppointments } from '../../hooks/useAppointments';
import { useDoctors } from '../../hooks/useDoctors';
import { usePatients } from '../../hooks/usePatients';
import { APPOINTMENT_STATUS } from '../../utils/constants';
import { formatDate, formatTime } from '../../utils/helpers';
import LoadingSpinner, { TableLoader } from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import Modal from '../common/Modal';
import AppointmentCard from './AppointmentCard';
import AppointmentFilters from './AppointmentFilters';
import AppointmentForm from './AppointmentForm';
import Pagination from '../common/Pagination';

/**
 * AppointmentList component with filtering and status management
 */
const AppointmentList = () => {
  const {
    appointments,
    loading,
    error,
    filters,
    pagination,
    selectedAppointmentIds,
    isAllSelected,
    hasSelection,
    sortConfig,
    isCreating,
    isUpdating,
    isCanceling,
    isCompleting,
    isDeleting,
    handleFilterChange,
    handlePageChange,
    handlePageSizeChange,
    handleSelectAll,
    handleSelectAppointmentId,
    handleSort,
    clearSelection,
    handleClearError,
    refetch,
    createAppointment,
    cancelAppointment,
    completeAppointment,
    deleteAppointment,
    getAppointmentStats,
  } = useAppointments();

  const { activeDoctors } = useDoctors({ skipQuery: false });
  const { patients } = usePatients({ skipQuery: false });

  // View mode state
  const [viewMode, setViewMode] = useState('cards'); // 'table' or 'cards'
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Get statistics
  const stats = getAppointmentStats();

  // Handle bulk operations
  const handleBulkCancel = async () => {
    if (!hasSelection) return;
    
    const reason = prompt('Please provide a reason for canceling these appointments:');
    if (reason !== null) {
      // Implementation for bulk cancel would go here
      clearSelection();
    }
  };

  const handleBulkComplete = async () => {
    if (!hasSelection) return;
    
    if (window.confirm(`Are you sure you want to mark ${selectedAppointmentIds.length} appointment(s) as completed?`)) {
      // Implementation for bulk complete would go here
      clearSelection();
    }
  };

  const handleBulkDelete = async () => {
    if (!hasSelection) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedAppointmentIds.length} appointment(s)?`)) {
      // Implementation for bulk delete would go here
      clearSelection();
    }
  };

  // Handle add appointment
  const handleAddAppointment = () => {
    setShowAddModal(true);
  };

  // Handle appointment form submission
  const handleAppointmentSubmit = async (appointmentData) => {
    const result = await createAppointment(appointmentData);
    if (result.success) {
      setShowAddModal(false);
      refetch(); // Refresh the appointment list
    }
    return result; // Return result to form for error handling
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="mt-2 text-gray-600">
            Manage patient appointments and schedules
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
          <button onClick={handleAddAppointment} className="btn-primary">
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Book Appointment
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total</dt>
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
                <svg className="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Booked</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.booked}</dd>
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
                  <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.completed}</dd>
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
                  <dt className="text-sm font-medium text-gray-500 truncate">Canceled</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.canceled}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Today</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.today}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <AppointmentFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          doctors={activeDoctors}
          patients={patients}
          onClear={() => handleFilterChange({ status: '', doctorId: '', patientId: '', date: '' })}
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
              {selectedAppointmentIds.length} appointment(s) selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={handleBulkComplete}
                disabled={isCompleting}
                className="text-sm text-green-600 hover:text-green-800 font-medium"
              >
                Complete Selected
              </button>
              <button
                onClick={handleBulkCancel}
                disabled={isCanceling}
                className="text-sm text-yellow-600 hover:text-yellow-800 font-medium"
              >
                Cancel Selected
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

      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">View:</span>
          <div className="flex rounded-md shadow-sm">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1 text-sm font-medium rounded-l-md border ${
                viewMode === 'cards'
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 text-sm font-medium rounded-r-md border-t border-r border-b ${
                viewMode === 'table'
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Table
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            Showing {appointments.length} of {pagination.total} appointments
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
      </div>

      {/* Content */}
      {loading ? (
        viewMode === 'table' ? (
          <TableLoader rows={5} columns={7} />
        ) : (
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
        )
      ) : appointments.length === 0 ? (
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
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {Object.values(filters).some(Boolean)
              ? 'Try adjusting your filters'
              : 'Get started by booking a new appointment'}
          </p>
          {!Object.values(filters).some(Boolean) && (
            <div className="mt-6">
              <button onClick={handleAddAppointment} className="btn-primary">
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Book Appointment
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment._id}
              appointment={appointment}
              selected={selectedAppointmentIds.includes(appointment._id)}
              onSelect={() => handleSelectAppointmentId(appointment._id)}
              onCancel={(reason) => cancelAppointment(appointment._id, reason)}
              onComplete={(notes) => completeAppointment(appointment._id, notes)}
              onDelete={() => deleteAppointment(appointment._id)}
              isCanceling={isCanceling}
              isCompleting={isCompleting}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          pageSize={pagination.limit}
          totalItems={pagination.total}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}

      {/* Add Appointment Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Book New Appointment"
        size="lg"
      >
        <AppointmentForm
          onSubmit={handleAppointmentSubmit}
          onCancel={() => setShowAddModal(false)}
          loading={isCreating}
          patients={patients}
          doctors={activeDoctors}
        />
      </Modal>
    </div>
  );
};

export default AppointmentList;