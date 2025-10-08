import { useState } from 'react';
import { formatDate, formatTime, getInitials, getStatusColor } from '../../utils/helpers';
import { QUEUE_STATUS, QUEUE_PRIORITY } from '../../utils/constants';

/**
 * QueueItem component with status update controls
 */
const QueueItem = ({
  queueItem,
  selected,
  onSelect,
  onStatusUpdate,
  onPriorityUpdate,
  onRemove,
  isUpdatingStatus,
  isUpdatingPriority,
  isRemoving,
}) => {
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showPriorityModal, setShowPriorityModal] = useState(false);
  const [statusNotes, setStatusNotes] = useState('');

  const handleStatusUpdate = (status) => {
    if (status === 'Completed') {
      setShowStatusModal(true);
    } else {
      onStatusUpdate(status, '');
    }
  };

  const handleStatusConfirm = () => {
    onStatusUpdate('Completed', statusNotes);
    setShowStatusModal(false);
    setStatusNotes('');
  };

  const handlePriorityUpdate = (priority) => {
    onPriorityUpdate(priority);
    setShowPriorityModal(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case QUEUE_STATUS.WAITING:
        return (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case QUEUE_STATUS.WITH_DOCTOR:
        return (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case QUEUE_STATUS.COMPLETED:
        return (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getPriorityIcon = (priority) => {
    if (priority === QUEUE_PRIORITY.URGENT) {
      return (
        <svg className="h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      );
    }
    return null;
  };

  const getWaitTime = () => {
    if (!queueItem.createdAt) return 'Unknown';
    
    const now = new Date();
    const created = new Date(queueItem.createdAt);
    const diffMs = now - created;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 60) {
      return `${diffMins} min`;
    } else {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return `${hours}h ${mins}m`;
    }
  };

  return (
    <>
      <div className={`bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 ${
        selected ? 'ring-2 ring-blue-500' : ''
      } ${queueItem.priority === QUEUE_PRIORITY.URGENT ? 'border-l-4 border-red-500' : ''}`}>
        <div className="p-6">
          <div className="flex items-center justify-between">
            {/* Left side - Patient info */}
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                checked={selected}
                onChange={onSelect}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              
              {/* Queue Number */}
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-lg font-bold text-white">
                    {queueItem.queueNumber || '#'}
                  </span>
                </div>
              </div>

              {/* Patient Avatar */}
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gray-500 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {getInitials(queueItem.patient?.name || queueItem.patientName || 'Patient')}
                  </span>
                </div>
              </div>

              {/* Patient Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {queueItem.patient?.name || queueItem.patientName || 'Unknown Patient'}
                  </h3>
                  {getPriorityIcon(queueItem.priority)}
                </div>
                <div className="flex items-center space-x-4 mt-1">
                  <p className="text-sm text-blue-600 font-medium">
                    Dr. {queueItem.doctor?.name || queueItem.doctorName || 'Unknown Doctor'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Wait time: {getWaitTime()}
                  </p>
                  {queueItem.appointmentTime && (
                    <p className="text-sm text-gray-500">
                      Appointment: {formatTime(queueItem.appointmentTime)}
                    </p>
                  )}
                </div>
                {queueItem.reason && (
                  <p className="text-sm text-gray-600 mt-1 truncate">
                    {queueItem.reason}
                  </p>
                )}
              </div>
            </div>

            {/* Right side - Status and actions */}
            <div className="flex items-center space-x-4">
              {/* Status Badge */}
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(queueItem.status)}`}>
                {getStatusIcon(queueItem.status)}
                <span className="ml-1">{queueItem.status}</span>
              </span>

              {/* Priority Badge */}
              {queueItem.priority === QUEUE_PRIORITY.URGENT && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  Urgent
                </span>
              )}

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                {queueItem.status === QUEUE_STATUS.WAITING && (
                  <button
                    onClick={() => handleStatusUpdate(QUEUE_STATUS.WITH_DOCTOR)}
                    disabled={isUpdatingStatus}
                    className="text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 rounded-md font-medium disabled:opacity-50"
                  >
                    Call In
                  </button>
                )}

                {queueItem.status === QUEUE_STATUS.WITH_DOCTOR && (
                  <button
                    onClick={() => handleStatusUpdate(QUEUE_STATUS.COMPLETED)}
                    disabled={isUpdatingStatus}
                    className="text-sm bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1 rounded-md font-medium disabled:opacity-50"
                  >
                    Complete
                  </button>
                )}

                <button
                  onClick={() => setShowPriorityModal(true)}
                  disabled={isUpdatingPriority}
                  className="text-sm text-gray-600 hover:text-gray-800 font-medium disabled:opacity-50"
                >
                  Priority
                </button>

                <button
                  onClick={() => onRemove(queueItem._id)}
                  disabled={isRemoving}
                  className="text-sm text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
                >
                  {isRemoving ? 'Removing...' : 'Remove'}
                </button>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          {queueItem.notes && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Notes:</strong> {queueItem.notes}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Complete Visit</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Completion notes (optional):
                </label>
                <textarea
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add any notes about the completed visit"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusConfirm}
                  disabled={isUpdatingStatus}
                  className="btn-success disabled:opacity-50"
                >
                  {isUpdatingStatus ? 'Completing...' : 'Mark as Complete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Priority Update Modal */}
      {showPriorityModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Update Priority</h3>
              <div className="space-y-3">
                <button
                  onClick={() => handlePriorityUpdate(QUEUE_PRIORITY.NORMAL)}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                    queueItem.priority === QUEUE_PRIORITY.NORMAL
                      ? 'bg-blue-50 border-blue-200 text-blue-700'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h8" />
                    </svg>
                    <div>
                      <div className="font-medium">Normal Priority</div>
                      <div className="text-sm text-gray-500">Standard queue order</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handlePriorityUpdate(QUEUE_PRIORITY.URGENT)}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                    queueItem.priority === QUEUE_PRIORITY.URGENT
                      ? 'bg-red-50 border-red-200 text-red-700'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div>
                      <div className="font-medium">Urgent Priority</div>
                      <div className="text-sm text-gray-500">Move to front of queue</div>
                    </div>
                  </div>
                </button>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowPriorityModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QueueItem;