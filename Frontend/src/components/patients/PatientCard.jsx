import { formatDate, getInitials } from '../../utils/helpers';

/**
 * Card view for individual patient
 */
const PatientCard = ({ 
  patient, 
  selected, 
  onSelect, 
  onDelete, 
  isDeleting 
}) => {
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
              <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-lg font-medium text-white">
                  {getInitials(patient.name)}
                </span>
              </div>
            </div>
          </div>
          
          {/* Actions dropdown */}
          <div className="relative">
            <button className="text-gray-400 hover:text-gray-600">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Patient Info */}
        <div className="ml-7">
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            {patient.name}
          </h3>
          <p className="text-sm text-gray-500 mb-3">
            ID: {patient._id.slice(-6)}
          </p>

          {/* Details */}
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <svg className="h-4 w-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-gray-600">
                {patient.age} years, {patient.gender}
              </span>
            </div>

            <div className="flex items-center text-sm">
              <svg className="h-4 w-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-gray-600 truncate">
                {patient.email}
              </span>
            </div>

            <div className="flex items-center text-sm">
              <svg className="h-4 w-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-gray-600">
                {patient.phone}
              </span>
            </div>

            {patient.address && (
              <div className="flex items-start text-sm">
                <svg className="h-4 w-4 text-gray-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-600 line-clamp-2">
                  {patient.address}
                </span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Created {formatDate(patient.createdAt)}
              </span>
              
              <div className="flex space-x-2">
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  View
                </button>
                <button className="text-sm text-gray-600 hover:text-gray-800 font-medium">
                  Edit
                </button>
                <button
                  onClick={() => onDelete(patient._id)}
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

export default PatientCard;