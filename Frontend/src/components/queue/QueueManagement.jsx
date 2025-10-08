import { useState, useEffect } from 'react';
import { useQueue } from '../../hooks/useQueue';
import { useDoctors } from '../../hooks/useDoctors';
import { usePatients } from '../../hooks/usePatients';
import { QUEUE_STATUS, QUEUE_PRIORITY } from '../../utils/constants';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import Modal from '../common/Modal';
import QueueItem from './QueueItem';
import QueueFilters from './QueueFilters';
import QueueForm from './QueueForm';

/**
 * QueueManagement component with doctor-specific queues
 */
const QueueManagement = () => {
  const {
    queue,
    loading,
    error,
    filters,
    queueStats,
    selectedQueueIds,
    hasSelection,
    isAdding,
    isUpdatingStatus,
    isUpdatingPriority,
    isRemoving,
    isCalling,
    handleFilterChange,
    handleSelectAll,
    handleSelectQueueId,
    clearSelection,
    handleClearError,
    refetch,
    addPatientToQueue,
    updatePatientStatus,
    updatePatientPriority,
    removePatientFromQueue,
    callNext,
    getQueueByDoctorId,
    getNextPatientForDoctor,
  } = useQueue();

  const { activeDoctors } = useDoctors({ skipQuery: false });
  const { patients } = usePatients({ skipQuery: false });

  // Local state
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [viewMode, setViewMode] = useState('all'); // 'all', 'by-doctor'
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Auto-select first doctor if available
  useEffect(() => {
    if (activeDoctors.length > 0 && !selectedDoctor) {
      setSelectedDoctor(activeDoctors[0]._id);
    }
  }, [activeDoctors, selectedDoctor]);

  // Handle bulk operations
  const handleBulkStatusUpdate = async (status) => {
    if (!hasSelection) return;
    
    const notes = status === 'Completed' 
      ? prompt('Add completion notes (optional):') || ''
      : '';
    
    // Implementation for bulk status update would go here
    clearSelection();
  };

  const handleBulkPriorityUpdate = async (priority) => {
    if (!hasSelection) return;
    
    // Implementation for bulk priority update would go here
    clearSelection();
  };

  const handleBulkRemove = async () => {
    if (!hasSelection) return;
    
    if (window.confirm(`Are you sure you want to remove ${selectedQueueIds.length} patient(s) from the queue?`)) {
      // Implementation for bulk remove would go here
      clearSelection();
    }
  };

  // Handle call next patient
  const handleCallNext = async (doctorId) => {
    const nextPatient = getNextPatientForDoctor(doctorId);
    if (!nextPatient) {
      alert('No patients waiting in queue for this doctor.');
      return;
    }
    
    const result = await callNext(doctorId);
    if (!result.success) {
      alert(`Failed to call next patient: ${result.error}`);
    }
  };

  // Handle add to queue
  const handleAddToQueue = () => {
    setShowAddModal(true);
  };

  // Handle queue form submission
  const handleQueueSubmit = async (queueData) => {
    const result = await addPatientToQueue(queueData);
    if (result.success) {
      setShowAddModal(false);
      refetch(); // Refresh the queue list
    }
    return result; // Return result to form for error handling
  };

  // Get filtered queue based on view mode
  const getDisplayQueue = () => {
    if (viewMode === 'by-doctor' && selectedDoctor) {
      return getQueueByDoctorId(selectedDoctor);
    }
    return queue;
  };

  const displayQueue = getDisplayQueue();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Queue Management</h1>
          <p className="mt-2 text-gray-600">
            Manage patient queue and track waiting times
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
          <button onClick={handleAddToQueue} className="btn-primary">
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add to Queue
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total in Queue</dt>
                  <dd className="text-lg font-medium text-gray-900">{queueStats.total}</dd>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Waiting</dt>
                  <dd className="text-lg font-medium text-gray-900">{queueStats.waiting}</dd>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">With Doctor</dt>
                  <dd className="text-lg font-medium text-gray-900">{queueStats.withDoctor}</dd>
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
                  <dd className="text-lg font-medium text-gray-900">{queueStats.completed}</dd>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Urgent</dt>
                  <dd className="text-lg font-medium text-gray-900">{queueStats.urgent}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View Mode and Doctor Selection */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">View:</span>
            <div className="flex rounded-md shadow-sm">
              <button
                onClick={() => setViewMode('all')}
                className={`px-3 py-1 text-sm font-medium rounded-l-md border ${
                  viewMode === 'all'
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                All Queues
              </button>
              <button
                onClick={() => setViewMode('by-doctor')}
                className={`px-3 py-1 text-sm font-medium rounded-r-md border-t border-r border-b ${
                  viewMode === 'by-doctor'
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                By Doctor
              </button>
            </div>
          </div>

          {/* Doctor Selection */}
          {viewMode === 'by-doctor' && (
            <div className="flex items-center space-x-2">
              <label htmlFor="doctor-select" className="text-sm font-medium text-gray-700">
                Doctor:
              </label>
              <select
                id="doctor-select"
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="block px-3 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Doctor</option>
                {activeDoctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    Dr. {doctor.name} - {doctor.specialization}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Call Next Button */}
          {viewMode === 'by-doctor' && selectedDoctor && (
            <button
              onClick={() => handleCallNext(selectedDoctor)}
              disabled={isCalling}
              className="btn-success disabled:opacity-50"
            >
              {isCalling && <LoadingSpinner size="sm" className="mr-2" />}
              {isCalling ? 'Calling...' : 'Call Next Patient'}
            </button>
          )}
        </div>

        <div className="text-sm text-gray-500">
          Showing {displayQueue.length} patient(s) in queue
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <QueueFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          doctors={activeDoctors}
          onClear={() => handleFilterChange({ doctorId: '', status: '', priority: '' })}
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
              {selectedQueueIds.length} patient(s) selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkStatusUpdate('With Doctor')}
                disabled={isUpdatingStatus}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Mark With Doctor
              </button>
              <button
                onClick={() => handleBulkStatusUpdate('Completed')}
                disabled={isUpdatingStatus}
                className="text-sm text-green-600 hover:text-green-800 font-medium"
              >
                Mark Completed
              </button>
              <button
                onClick={() => handleBulkPriorityUpdate('Urgent')}
                disabled={isUpdatingPriority}
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Mark Urgent
              </button>
              <button
                onClick={handleBulkRemove}
                disabled={isRemoving}
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                {isRemoving ? 'Removing...' : 'Remove Selected'}
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

      {/* Queue Content */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="h-8 w-16 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : displayQueue.length === 0 ? (
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
          <h3 className="mt-2 text-sm font-medium text-gray-900">No patients in queue</h3>
          <p className="mt-1 text-sm text-gray-500">
            {viewMode === 'by-doctor' && selectedDoctor
              ? 'No patients waiting for the selected doctor'
              : 'The queue is currently empty'}
          </p>
          <div className="mt-6">
            <button onClick={handleAddToQueue} className="btn-primary">
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Patient to Queue
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {displayQueue.map((queueItem) => (
            <QueueItem
              key={queueItem._id}
              queueItem={queueItem}
              selected={selectedQueueIds.includes(queueItem._id)}
              onSelect={() => handleSelectQueueId(queueItem._id)}
              onStatusUpdate={(status, notes) => updatePatientStatus(queueItem._id, status, notes)}
              onPriorityUpdate={(priority) => updatePatientPriority(queueItem._id, priority)}
              onRemove={() => removePatientFromQueue(queueItem._id)}
              isUpdatingStatus={isUpdatingStatus}
              isUpdatingPriority={isUpdatingPriority}
              isRemoving={isRemoving}
            />
          ))}
        </div>
      )}

      {/* Add to Queue Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Patient to Queue"
        size="lg"
      >
        <QueueForm
          onSubmit={handleQueueSubmit}
          onCancel={() => setShowAddModal(false)}
          loading={isAdding}
          patients={patients}
          doctors={activeDoctors}
        />
      </Modal>
    </div>
  );
};

export default QueueManagement;