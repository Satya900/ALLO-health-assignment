import { GENDER_OPTIONS } from '../../utils/constants';

/**
 * Filter component for patients
 */
const PatientFilters = ({ filters, onFilterChange, onClear, className = "" }) => {
  const ageRangeOptions = [
    { value: '', label: 'All Ages' },
    { value: 'child', label: 'Children (0-17)' },
    { value: 'adult', label: 'Adults (18-64)' },
    { value: 'senior', label: 'Seniors (65+)' },
  ];

  const handleFilterChange = (key, value) => {
    onFilterChange({ [key]: value });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className={`bg-gray-50 border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          {/* Gender Filter */}
          <div className="flex items-center space-x-2">
            <label htmlFor="gender-filter" className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Gender:
            </label>
            <select
              id="gender-filter"
              value={filters.gender || ''}
              onChange={(e) => handleFilterChange('gender', e.target.value)}
              className="block w-full sm:w-auto px-3 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Genders</option>
              {GENDER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Age Range Filter */}
          <div className="flex items-center space-x-2">
            <label htmlFor="age-filter" className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Age:
            </label>
            <select
              id="age-filter"
              value={filters.ageRange || ''}
              onChange={(e) => handleFilterChange('ageRange', e.target.value)}
              className="block w-full sm:w-auto px-3 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {ageRangeOptions.map((option) => (
                <option key={option.value} value={option.value}>
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
          {filters.gender && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Gender: {filters.gender}
              <button
                onClick={() => handleFilterChange('gender', '')}
                className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600 focus:outline-none focus:bg-blue-200 focus:text-blue-600"
              >
                <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 8 8">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M1 1l6 6m0-6L1 7" />
                </svg>
              </button>
            </span>
          )}
          {filters.ageRange && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Age: {ageRangeOptions.find(opt => opt.value === filters.ageRange)?.label}
              <button
                onClick={() => handleFilterChange('ageRange', '')}
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

export default PatientFilters;