import { SPECIALIZATIONS } from '../../utils/constants';

/**
 * Filter component for doctors
 */
const DoctorFilters = ({ 
  filters, 
  onFilterChange, 
  specializations = [], 
  onClear, 
  className = "" 
}) => {
  const statusOptions = [
    { value: null, label: 'All Status' },
    { value: true, label: 'Active' },
    { value: false, label: 'Inactive' },
  ];

  // Use provided specializations or default ones
  const availableSpecializations = specializations.length > 0 
    ? specializations 
    : SPECIALIZATIONS;

  const handleFilterChange = (key, value) => {
    // Handle boolean conversion for isActive
    if (key === 'isActive') {
      value = value === 'true' ? true : value === 'false' ? false : null;
    }
    onFilterChange({ [key]: value });
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== '' && value !== null && value !== undefined
  );

  return (
    <div className={`bg-gray-50 border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          {/* Specialization Filter */}
          <div className="flex items-center space-x-2">
            <label htmlFor="specialization-filter" className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Specialization:
            </label>
            <select
              id="specialization-filter"
              value={filters.specialization || ''}
              onChange={(e) => handleFilterChange('specialization', e.target.value)}
              className="block w-full sm:w-auto px-3 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Specializations</option>
              {availableSpecializations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div className="flex items-center space-x-2">
            <label htmlFor="location-filter" className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Location:
            </label>
            <input
              type="text"
              id="location-filter"
              value={filters.location || ''}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="block w-full sm:w-auto px-3 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter location"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <label htmlFor="status-filter" className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Status:
            </label>
            <select
              id="status-filter"
              value={filters.isActive === null ? '' : filters.isActive.toString()}
              onChange={(e) => handleFilterChange('isActive', e.target.value)}
              className="block w-full sm:w-auto px-3 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {statusOptions.map((option) => (
                <option key={option.label} value={option.value === null ? '' : option.value.toString()}>
                  {option.label}
                </option>
              ))}
            </select>
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
          {filters.specialization && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Specialization: {filters.specialization}
              <button
                onClick={() => handleFilterChange('specialization', '')}
                className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600 focus:outline-none focus:bg-blue-200 focus:text-blue-600"
              >
                <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 8 8">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M1 1l6 6m0-6L1 7" />
                </svg>
              </button>
            </span>
          )}
          {filters.location && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Location: {filters.location}
              <button
                onClick={() => handleFilterChange('location', '')}
                className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600 focus:outline-none focus:bg-blue-200 focus:text-blue-600"
              >
                <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 8 8">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M1 1l6 6m0-6L1 7" />
                </svg>
              </button>
            </span>
          )}
          {filters.isActive !== null && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Status: {filters.isActive ? 'Active' : 'Inactive'}
              <button
                onClick={() => handleFilterChange('isActive', null)}
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

export default DoctorFilters;