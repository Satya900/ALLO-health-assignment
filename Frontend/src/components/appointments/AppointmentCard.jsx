import { useState } from 'react';
import { formatDate, formatTime, getStatusColor, getInitials } from '../../utils/helpers';

/**
 * Card view for individual appointment
 */
const AppointmentCard = ({ 
  appointment, 
  selected, 
  onSelect, 
  onCancel, 
  onComplete,
  onDelete,
  isCanceling,
  isCompleting,
  isDeleting 
}) => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [completionNotes, setCompletionNotes] = useState('');

  const handleCancel = () => {
    if (onCancel) {
      onCancel(cancelReason);
      setShowCancelModal(false);
      setCancelReason('');
    }
  };

  const handleComplete = () => {
    if (onComplete) {
      onComplete(completionNotes);
      setShowCompleteModal(false);
      setCompletionNotes('');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Booked':
        return (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'Completed':
        return (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'Canceled':
        return (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className={`bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 ${
        selected ? 'ring-2 ring-blue-500' : ''
      }`}>
        <div className="p-6">
          {/* Header with checkbox and status */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={selected}
                onChange={onSelect}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
              />
              <div className="flex-shrink-0 h-10 w-10">
                <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {getInitials(appointment.patient?.name || appointment.patientName || 'Patient')}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Status Badge */}
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
              {getStatusIcon(appointment.status)}
              <span className="ml-1">{appointment.status}</span>
            </span>
          </div>

          {/* Appointment Info */}
          <div className="ml-7">
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              {appointment.patient?.name || appointment.patientName || 'Unknown Patient'}
            </h3>
            <p className="text-sm text-blue-600 font-medium mb-3">
              Dr. {appointment.doctor?.name || appointment.doctorName || 'Unknown Doctor'}
            </p>

            {/* Details */}
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <svg className="h-4 w-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-600">
                  {formatDate(appointment.date)} at {formatTime(appointment.time)}
                </span>
              </div>

              <div className="flex items-start text-sm">
                <svg className="h-4 w-4 text-gray-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-gray-600 line-clamp-2">
                  {appointment.reason}
                </span>
              </div>

              {appointment.priority === 'Urgent' && (
                <div className="flex items-center text-sm">
                  <svg className="h-4 w-4 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="text-red-600 font-medium">Urgent</span>
                </div>
              )}

              {appointment.notes && (
                <div className="mt-3 p-2 bg-gray-50 rounded text-sm text-gray-600">
                  <strong>Notes:</strong> {appointment.notes}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  ID: {appointment._id.slice(-6)}
                </span>
                
                <div className="flex space-x-2">
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    View
                  </button>
                  <button className="text-sm text-gray-600 hover:text-gray-800 font-medium">
                    Edit
                  </button>
                  
                  {appointment.status === 'Booked' && (
                    <>
                      <button
                        onClick={() => setShowCompleteModal(true)}
                        disabled={isCompleting}
                        className="text-sm text-green-600 hover:text-green-800 font-medium disabled:opacity-50"
                      >
                        {isCompleting ? 'Completing...' : 'Complete'}
                      </button>
                      <button
                        onClick={() => setShowCancelModal(true)}
                        disabled={isCanceling}
                        className="text-sm text-yellow-600 hover:text-yellow-800 font-medium disabled:opacity-50"
                      >
                        {isCanceling ? 'Canceling...' : 'Cancel'}
                      </button>
                    </>
                  )}
                  
                  <button
                    onClick={() => onDelete(appointment._id)}
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

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Cancel Appointment</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for cancellation:
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Please provide a reason for canceling this appointment"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="btn-secondary"
                >
                  Close
                </button>
                <button
                  onClick={handleCancel}
                  disabled={!cancelReason.trim() || isCanceling}
                  className="btn-danger disabled:opacity-50"
                >
                  {isCanceling ? 'Canceling...' : 'Cancel Appointment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Complete Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Complete Appointment</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Completion notes (optional):
                </label>
                <textarea
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add any notes about the completed appointment"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCompleteModal(false)}
                  className="btn-secondary"
                >
                  Close
                </button>
                <button
                  onClick={handleComplete}
                  disabled={isCompleting}
                  className="btn-success disabled:opacity-50"
                >
                  {isCompleting ? 'Completing...' : 'Mark as Complete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AppointmentCard;