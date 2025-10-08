import { APPOINTMENT_STATUS } from "../../utils/constants";

/**
 * Filter component for appointments
 */
const AppointmentFilters = ({
  filters,
  onFilterChange,
  doctors = [],
  patients = [],
  onClear,
  className = "",
}) => {
  const statusOptions = [
    { value: "", label: "All Status" },
    { value: APPOINTMENT_STATUS.BOOKED, label: "Booked" },
    { value: APPOINTMENT_STATUS.COMPLETED, label: "Completed" },
    { value: APPOINTMENT_STATUS.CANCELED, label: "Canceled" },
  ];

  const handleFilterChange = (key, value) => {
    onFilterChange({ [key]: value });
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== "" && value !== null && value !== undefined
  );

  return (
    <div
      className={`bg-gray-50 border border-gray-200 rounded-lg p-4 ${className}`}
    >
      <div className="flex flex-col space-y-4">
        {/* First Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <label
                htmlFor="status-filter"
                className="text-sm font-medium text-gray-700 whitespace-nowrap"
              >
                Status:
              </label>
              <select
                id="status-filter"
                value={filters.status || ""}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="block w-full sm:w-auto px-3 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Doctor Filter */}
            <div className="flex items-center space-x-2">
              <label
                htmlFor="doctor-filter"
                className="text-sm font-medium text-gray-700 whitespace-nowrap"
              >
                Doctor:
              </label>
              <select
                id="doctor-filter"
                value={filters.doctorId || ""}
                onChange={(e) => handleFilterChange("doctorId", e.target.value)}
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

            {/* Patient Filter */}
            <div className="flex items-center space-x-2">
              <label
                htmlFor="patient-filter"
                className="text-sm font-medium text-gray-700 whitespace-nowrap"
              >
                Patient:
              </label>
              <select
                id="patient-filter"
                value={filters.patientId || ""}
                onChange={(e) =>
                  handleFilterChange("patientId", e.target.value)
                }
                className="block w-full sm:w-auto px-3 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Patients</option>
                {patients.map((patient) => (
                  <option key={patient._id} value={patient._id}>
                    {patient.name} - {patient.phone}
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

        {/* Second Row - Date Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          {/* Single Date Filter */}
          <div className="flex items-center space-x-2">
            <label
              htmlFor="date-filter"
              className="text-sm font-medium text-gray-700 whitespace-nowrap"
            >
              Date:
            </label>
            <input
              type="date"
              id="date-filter"
              value={filters.date || ""}
              onChange={(e) => handleFilterChange("date", e.target.value)}
              className="block w-full sm:w-auto px-3 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Date Range Filters */}
          <div className="flex items-center space-x-2">
            <label
              htmlFor="start-date-filter"
              className="text-sm font-medium text-gray-700 whitespace-nowrap"
            >
              From:
            </label>
            <input
              type="date"
              id="start-date-filter"
              value={filters.startDate || ""}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
              className="block w-full sm:w-auto px-3 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <label
              htmlFor="end-date-filter"
              className="text-sm font-medium text-gray-700 whitespace-nowrap"
            >
              To:
            </label>
            <input
              type="date"
              id="end-date-filter"
              value={filters.endDate || ""}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
              className="block w-full sm:w-auto px-3 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-3 flex flex-wrap gap-2">
          {filters.status && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Status: {filters.status}
              <button
                onClick={() => handleFilterChange("status", "")}
                className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600 focus:outline-none focus:bg-blue-200 focus:text-blue-600"
              >
                <svg
                  className="w-2 h-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 8 8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M1 1l6 6m0-6L1 7"
                  />
                </svg>
              </button>
            </span>
          )}
          {filters.doctorId && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Doctor:{" "}
              {doctors.find((d) => d._id === filters.doctorId)?.name ||
                "Selected"}
              <button
                onClick={() => handleFilterChange("doctorId", "")}
                className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600 focus:outline-none focus:bg-blue-200 focus:text-blue-600"
              >
                <svg
                  className="w-2 h-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 8 8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M1 1l6 6m0-6L1 7"
                  />
                </svg>
              </button>
            </span>
          )}
          {filters.patientId && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Patient:{" "}
              {patients.find((p) => p._id === filters.patientId)?.name ||
                "Selected"}
              <button
                onClick={() => handleFilterChange("patientId", "")}
                className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600 focus:outline-none focus:bg-blue-200 focus:text-blue-600"
              >
                <svg
                  className="w-2 h-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 8 8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M1 1l6 6m0-6L1 7"
                  />
                </svg>
              </button>
            </span>
          )}
          {filters.date && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Date: {filters.date}
              <button
                onClick={() => handleFilterChange("date", "")}
                className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600 focus:outline-none focus:bg-blue-200 focus:text-blue-600"
              >
                <svg
                  className="w-2 h-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 8 8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M1 1l6 6m0-6L1 7"
                  />
                </svg>
              </button>
            </span>
          )}
          {(filters.startDate || filters.endDate) && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Range: {filters.startDate || "..."} to {filters.endDate || "..."}
              <button
                onClick={() => {
                  handleFilterChange("startDate", "");
                  handleFilterChange("endDate", "");
                }}
                className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600 focus:outline-none focus:bg-blue-200 focus:text-blue-600"
              >
                <svg
                  className="w-2 h-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 8 8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M1 1l6 6m0-6L1 7"
                  />
                </svg>
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default AppointmentFilters;
