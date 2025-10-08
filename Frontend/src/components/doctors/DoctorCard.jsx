import { formatDate, getInitials, getStatusColor } from '../../utils/helpers';

/**
 * Card view for individual doctor with availability display
 */
const DoctorCard = ({ 
  doctor, 
  selected, 
  onSelect, 
  onDelete, 
  onToggleStatus,
  isDeleting,
  isTogglingStatus 
}) => {
  const handleStatusToggle = () => {
    if (onToggleStatus) {
      onToggleStatus(!doctor.isActive);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 ${
      selected ? 'ring-2 ring-blue-500' : ''
    }`}>
      <div className="p-6">
        {/* Header with checkbox and avatar */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={selected}
              onChange={onSelect}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
            />
            <div className="flex-shrink-0 h-12 w-12">
              <div className="h-12 w-12 rounded-full bg-purple-500 flex items-center justify-center">
                <span className="text-lg font-medium text-white">
                  {getInitials(doctor.name)}
                </span>
              </div>
            </div>
          </div>
          
          {/* Status Badge */}
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            doctor.isActive 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {doctor.isActive ? 'On Duty' : 'Off Duty'}
          </span>
        </div>

        {/* Doctor Info */}
        <div className="ml-7">
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            Dr. {doctor.name}
          </h3>
          <p className="text-sm text-blue-600 font-medium mb-3">
            {doctor.specialization}
          </p>

          {/* Details */}
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <svg className="h-4 w-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-gray-600 truncate">
                {doctor.email}
              </span>
            </div>

            <div className="flex items-center text-sm">
              <svg className="h-4 w-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-gray-600">
                {doctor.phone}
              </span>
            </div>

            {doctor.location && (
              <div className="flex items-center text-sm">
                <svg className="h-4 w-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-600">
                  {doctor.location}
                </span>
              </div>
            )}

            {doctor.gender && (
              <div className="flex items-center text-sm">
                <svg className="h-4 w-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-gray-600">
                  {doctor.gender}
                </span>
              </div>
            )}
          </div>

          {/* Availability Preview */}
          {doctor.availability && doctor.availability.length > 0 && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="text-xs font-medium text-gray-700 mb-2">Today's Availability</h4>
              <div className="flex flex-wrap gap-1">
                {doctor.availability.slice(0, 4).map((slot, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800"
                  >
                    {slot}
                  </span>
                ))}
                {doctor.availability.length > 4 && (
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    +{doctor.availability.length - 4} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Joined {formatDate(doctor.createdAt)}
              </span>
              
              <div className="flex space-x-2">
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  View
                </button>
                <button className="text-sm text-gray-600 hover:text-gray-800 font-medium">
                  Edit
                </button>
                <button
                  onClick={handleStatusToggle}
                  disabled={isTogglingStatus}
                  className={`text-sm font-medium disabled:opacity-50 ${
                    doctor.isActive 
                      ? 'text-red-600 hover:text-red-800' 
                      : 'text-green-600 hover:text-green-800'
                  }`}
                >
                  {isTogglingStatus 
                    ? 'Updating...' 
                    : (doctor.isActive ? 'Set Off Duty' : 'Set On Duty')
                  }
                </button>
                <button
                  onClick={() => onDelete(doctor._id)}
                  disabled={isDeleting}
                  className="text-sm text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;