import { useState, useEffect } from 'react';
import { debounce } from '../../utils/helpers';

/**
 * Search bar component for patients
 */
const PatientSearchBar = ({ 
  searchQuery, 
  onSearch, 
  placeholder = "Search patients...",
  className = "" 
}) => {
  const [localQuery, setLocalQuery] = useState(searchQuery || '');

  // Debounced search function
  const debouncedSearch = debounce((query) => {
    onSearch(query);
  }, 300);

  // Update local state when prop changes
  useEffect(() => {
    setLocalQuery(searchQuery || '');
  }, [searchQuery]);

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocalQuery(value);
    debouncedSearch(value);
  };

  // Handle clear search
  const handleClear = () => {
    setLocalQuery('');
    onSearch('');
  };

  // Handle form submit (prevent page reload)
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(localQuery);
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        {/* Search icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Search input */}
        <input
          type="text"
          value={localQuery}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />

        {/* Clear button */}
        {localQuery && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Search suggestions or recent searches could go here */}
    </form>
  );
};

export default PatientSearchBar;