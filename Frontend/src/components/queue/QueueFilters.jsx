import { QUEUE_STATUS, QUEUE_PRIORITY } from '../../utils/constants';

/**
 * Filter component for queue management
 */
const QueueFilters = ({ 
  filters, 
  onFilterChange, 
  doctors = [],
  onClear, 
  className = "" 
}) => {
  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: QUEUE_STATUS.WAITING, label: 'Waiting' },
    { value: QUEUE_STATUS.WITH_DOCTOR, label: 'With Doctor' },
    { value: QUEUE_STATUS.COMPLETED, label: 'Completed' },
  ];

  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: QUEUE_PRIORITY.NORMAL, label: 'Normal' },
    { value: QUEUE_PRIORITY.URGENT, label: 'Urgent' },
  ];

  const handleFilterChange = (key, value) => {
    onFilterChange({ [key]: value });
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== '' && value !== null && value !== undefined
  );

  return (
    <div className={`bg-gray-50 border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          {/* Doctor Filter */}
          <div className="flex items-center space-x-2">
            <label htmlFor="doctor-filter" className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Doctor:
            </label>
            <select
              id="doctor-filter"
              value={filters.doctorId || ''}
              onChange={(e) => handleFilterChange('doctorId', e.target.value)}
              className="block w-full sm:w-auto px-3 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Doctors</option>
              {doctors.map((doctor) => (
                <option key={doctor._id} value={doctor._id}>
                  Dr. {doctor.name} - {doctor.specialization}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <label htmlFor="status-filter" className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Status:
            </label>
            <select
              id="status-filter"
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="block w-full sm:w-auto px-3 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center space-x-2">
            <label htmlFor="priority-filter" className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Priority:
            </label>
            <select
              id="priority-filter"
              value={filters.priority || ''}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="block w-full sm:w-auto px-3 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {priorityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex items-center space-x-2">
            <label htmlFor="date-filter" className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Date:
            </label>
            <input
              type="date"
              id="date-filter"
              value={filters.date || ''}
              onChange={(e) => handleFilterChange('date', e.target.value)}
              className="block w-full sm:w-auto px-3 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-3 flex flex-wrap gap-2">
          {filters.doctorId && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Doctor: {doctors.find(d => d._id === filters.doctorId)?.name || 'Selected'}
              <button
                onClick={() => handleFilterChange('doctorId', '')}
                className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600 focus:outline-none focus:bg-blue-200 focus:text-blue-600"
              >
                <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 8 8">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M1 1l6 6m0-6L1 7" />
                </svg>
              </button>
            </span>
          )}
          {filters.status && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Status: {filters.status}
              <button
                onClick={() => handleFilterChange('status', '')}
                className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600 focus:outline-none focus:bg-blue-200 focus:text-blue-600"
              >
                <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 8 8">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M1 1l6 6m0-6L1 7" />
                </svg>
              </button>
            </span>
          )}
          {filters.priority && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Priority: {filters.priority}
              <button
                onClick={() => handleFilterChange('priority', '')}
                className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600 focus:outline-none focus:bg-blue-200 focus:text-blue-600"
              >
                <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 8 8">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M1 1l6 6m0-6L1 7" />
                </svg>
              </button>
            </span>
          )}
          {filters.date && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Date: {filters.date}
              <button
                onClick={() => handleFilterChange('date', '')}
                className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600 focus:outline-none focus:bg-blue-200 focus:text-blue-600"
              >
                <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 8 8">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M1 1l6 6m0-6L1 7" />
                </svg>
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default QueueFilters;