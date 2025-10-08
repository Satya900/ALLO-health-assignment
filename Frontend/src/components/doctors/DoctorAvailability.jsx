import { useState, useEffect } from 'react';
import { formatDate, formatTime } from '../../utils/helpers';
import { TIME_SLOTS } from '../../utils/constants';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

/**
 * DoctorAvailability component for viewing and updating time slots
 */
const DoctorAvailability = ({
  doctor,
  availability = [],
  onUpdateAvailability,
  loading = false,
  error = null,
  isUpdating = false,
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  // Initialize selected slots when availability changes
  useEffect(() => {
    if (availability && availability.length > 0) {
      setSelectedSlots(availability);
    }
  }, [availability]);

  // Handle slot selection
  const handleSlotToggle = (slot) => {
    setSelectedSlots(prev => 
      prev.includes(slot)
        ? prev.filter(s => s !== slot)
        : [...prev, slot].sort()
    );
  };

  // Handle select all slots
  const handleSelectAll = () => {
    if (selectedSlots.length === TIME_SLOTS.length) {
      setSelectedSlots([]);
    } else {
      setSelectedSlots([...TIME_SLOTS]);
    }
  };

  // Handle save availability
  const handleSave = async () => {
    if (onUpdateAvailability) {
      const result = await onUpdateAvailability(doctor._id, selectedSlots);
      if (result.success) {
        setIsEditing(false);
      }
    }
  };

  // Handle cancel editing
  const handleCancel = () => {
    setSelectedSlots(availability || []);
    setIsEditing(false);
  };

  // Get next 7 days for date selection
  const getNextSevenDays = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push({
        value: date.toISOString().split('T')[0],
        label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : formatDate(date, 'short'),
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      });
    }
    
    return days;
  };

  const availableDays = getNextSevenDays();

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Availability Management
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Manage {doctor ? `Dr. ${doctor.name}'s` : 'doctor'} available time slots
            </p>
          </div>
          <div className="flex space-x-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary"
              >
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Schedule
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleCancel}
                  disabled={isUpdating}
                  className="btn-secondary disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isUpdating}
                  className="btn-primary disabled:opacity-50"
                >
                  {isUpdating && <LoadingSpinner size="sm" className="mr-2" />}
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Error Message */}
        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} type="error" />
          </div>
        )}

        {/* Date Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Date
          </label>
          <div className="grid grid-cols-7 gap-2">
            {availableDays.map((day) => (
              <button
                key={day.value}
                onClick={() => setSelectedDate(day.value)}
                className={`p-3 text-center rounded-lg border transition-colors ${
                  selectedDate === day.value
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="text-xs font-medium">{day.dayName}</div>
                <div className="text-sm">{day.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Time Slots */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Available Time Slots
            </label>
            {isEditing && (
              <button
                onClick={handleSelectAll}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                {selectedSlots.length === TIME_SLOTS.length ? 'Deselect All' : 'Select All'}
              </button>
            )}
          </div>

          {/* Time Slots Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {TIME_SLOTS.map((slot) => {
              const isSelected = selectedSlots.includes(slot);
              const isAvailable = availability.includes(slot);
              
              return (
                <div key={slot} className="relative">
                  {isEditing ? (
                    <button
                      onClick={() => handleSlotToggle(slot)}
                      className={`w-full p-3 text-sm font-medium rounded-lg border transition-colors ${
                        isSelected
                          ? 'bg-green-50 border-green-200 text-green-700'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {formatTime(slot)}
                    </button>
                  ) : (
                    <div
                      className={`w-full p-3 text-sm font-medium rounded-lg border text-center ${
                        isAvailable
                          ? 'bg-green-50 border-green-200 text-green-700'
                          : 'bg-gray-50 border-gray-200 text-gray-400'
                      }`}
                    >
                      {formatTime(slot)}
                    </div>
                  )}
                  
                  {/* Status indicator */}
                  {!isEditing && (
                    <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                      isAvailable ? 'bg-green-400' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center space-x-6 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
              <span className="text-gray-600">Available</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
              <span className="text-gray-600">Not Available</span>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Total Slots:</span>
                <span className="ml-2 text-gray-900">{TIME_SLOTS.length}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Available:</span>
                <span className="ml-2 text-green-600 font-medium">
                  {isEditing ? selectedSlots.length : availability.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        {isEditing && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex">
              <svg className="h-5 w-5 text-blue-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Editing Instructions:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Click on time slots to toggle availability</li>
                  <li>Green slots are available for appointments</li>
                  <li>Use "Select All" to quickly select all time slots</li>
                  <li>Don't forget to save your changes</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorAvailability;