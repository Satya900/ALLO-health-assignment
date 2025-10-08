import { useState } from 'react';
import { usePatients } from '../../hooks/usePatients';
import { TableLoader } from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import Modal from '../common/Modal';
import PatientSearchBar from './PatientSearchBar';
import PatientFilters from './PatientFilters';
import PatientTable from './PatientTable';
import PatientCard from './PatientCard';
import PatientForm from './PatientForm';
import Pagination from '../common/Pagination';

/**
 * PatientList component with search, filter, and pagination
 */
const PatientList = () => {
  const {
    patients,
    loading,
    error,
    searchQuery,
    filters,
    pagination,
    selectedPatientIds,
    isAllSelected,
    hasSelection,
    sortConfig,
    isCreating,
    isDeleting,
    handleSearch,
    handleFilterChange,
    handlePageChange,
    handlePageSizeChange,
    handleSelectAll,
    handleSelectPatientId,
    handleSort,
    clearSelection,
    handleClearError,
    refetch,
    createPatient,
    deletePatient,
  } = usePatients();

  // View mode state
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (!hasSelection) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedPatientIds.length} patient(s)?`)) {
      // Implementation for bulk delete would go here
      clearSelection();
    }
  };

  // Handle add patient
  const handleAddPatient = () => {
    setShowAddModal(true);
  };

  // Handle patient form submission
  const handlePatientSubmit = async (patientData) => {
    const result = await createPatient(patientData);
    if (result.success) {
      setShowAddModal(false);
      refetch(); // Refresh the patient list
    }
    return result; // Return result to form for error handling
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
          <p className="mt-2 text-gray-600">
            Manage patient records and information
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
          <button onClick={handleAddPatient} className="btn-primary">
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Patient
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <PatientSearchBar
          searchQuery={searchQuery}
          onSearch={handleSearch}
          placeholder="Search patients by name, email, or phone..."
        />
        
        {showFilters && (
          <PatientFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClear={() => handleFilterChange({ gender: '', ageRange: '' })}
          />
        )}
      </div>

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
              {selectedPatientIds.length} patient(s) selected
            </span>
            <div className="flex space-x-2">
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
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 text-sm font-medium rounded-l-md border ${
                viewMode === 'table'
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1 text-sm font-medium rounded-r-md border-t border-r border-b ${
                viewMode === 'cards'
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Cards
            </button>
          </div>
        </div>
        
        <div className="text-sm text-gray-500">
          Showing {patients.length} of {pagination.total} patients
        </div>
      </div>

      {/* Content */}
      {loading ? (
        viewMode === 'table' ? (
          <TableLoader rows={5} columns={6} />
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
      ) : patients.length === 0 ? (
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
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No patients found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery || Object.values(filters).some(Boolean)
              ? 'Try adjusting your search or filters'
              : 'Get started by adding a new patient'}
          </p>
          {!searchQuery && !Object.values(filters).some(Boolean) && (
            <div className="mt-6">
              <button onClick={handleAddPatient} className="btn-primary">
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Patient
              </button>
            </div>
          )}
        </div>
      ) : viewMode === 'table' ? (
        <PatientTable
          patients={patients}
          selectedPatientIds={selectedPatientIds}
          isAllSelected={isAllSelected}
          sortConfig={sortConfig}
          onSelectAll={handleSelectAll}
          onSelectPatient={handleSelectPatientId}
          onSort={handleSort}
          onDeletePatient={deletePatient}
          isDeleting={isDeleting}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patients.map((patient) => (
            <PatientCard
              key={patient._id}
              patient={patient}
              selected={selectedPatientIds.includes(patient._id)}
              onSelect={() => handleSelectPatientId(patient._id)}
              onDelete={() => deletePatient(patient._id)}
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

      {/* Add Patient Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Patient"
        size="lg"
      >
        <PatientForm
          onSubmit={handlePatientSubmit}
          onCancel={() => setShowAddModal(false)}
          loading={isCreating}
        />
      </Modal>
    </div>
  );
};

export default PatientList;