import { useState, useEffect } from 'react';
import { validateForm } from '../../utils/validators';
import { APPOINTMENT_STATUS, TIME_SLOTS } from '../../utils/constants';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage, { InlineError } from '../common/ErrorMessage';

/**
 * Appointment form component for creating and editing appointments
 */
const AppointmentForm = ({
  appointment = null,
  onSubmit,
  onCancel,
  loading = false,
  error = null,
  patients = [],
  doctors = [],
}) => {
  // Form state
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    date: '',
    time: '',
    duration: 30,
    reason: '',
    notes: '',
    status: 'Booked',
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with appointment data if editing
  useEffect(() => {
    if (appointment) {
      setFormData({
        patientId: appointment.patientId || '',
        doctorId: appointment.doctorId || '',
        date: appointment.date || '',
        time: appointment.time || '',
        duration: appointment.duration || 30,
        reason: appointment.reason || '',
        notes: appointment.notes || '',
        status: appointment.status || 'Booked',
      });
    }
  }, [appointment]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  // Validate form
  const validateAppointmentForm = () => {
    const rules = {
      patientId: {
        required: true,
      },
      doctorId: {
        required: true,
      },
      date: {
        required: true,
        date: true,
        futureOnly: true,
      },
      time: {
        required: true,
        time: true,
      },
      reason: {
        required: true,
        minLength: 3,
        maxLength: 200,
      },
      notes: {
        maxLength: 500,
      },
    };

    return validateForm(formData, rules);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const validation = validateAppointmentForm();
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    setFormErrors({});

    try {
      const result = await onSubmit(formData);
      
      // If onSubmit returns a result object, check for success
      if (result && !result.success) {
        setFormErrors({
          general: result.error || 'An error occurred while saving the appointment.',
        });
        return;
      }
      
      // If we get here, the submission was successful
      // The parent component will handle closing the modal
    } catch (error) {
      setFormErrors({
        general: error.message || 'An error occurred while saving the appointment.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = loading || isSubmitting;

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Error */}
        {(formErrors.general || error) && (
          <ErrorMessage
            message={formErrors.general || error}
            type="error"
          />
        )}

        {/* Patient and Doctor Selection */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4">Appointment Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Patient */}
            <div>
              <label htmlFor="patientId" className="form-label">
                Patient *
              </label>
              <select
                id="patientId"
                name="patientId"
                value={formData.patientId}
                onChange={handleInputChange}
                className={`input-field ${formErrors.patientId ? 'border-red-300' : ''}`}
                disabled={isLoading}
              >
                <option value="">Select patient</option>
                {patients.map((patient) => (
                  <option key={patient._id} value={patient._id}>
                    {patient.name} - {patient.phone}
                  </option>
                ))}
              </select>
              <InlineError message={formErrors.patientId?.[0]} />
            </div>

            {/* Doctor */}
            <div>
              <label htmlFor="doctorId" className="form-label">
                Doctor *
              </label>
              <select
                id="doctorId"
                name="doctorId"
                value={formData.doctorId}
                onChange={handleInputChange}
                className={`input-field ${formErrors.doctorId ? 'border-red-300' : ''}`}
                disabled={isLoading}
              >
                <option value="">Select doctor</option>
                {doctors.filter(d => d.isActive).map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    Dr. {doctor.name} - {doctor.specialization}
                  </option>
                ))}
              </select>
              <InlineError message={formErrors.doctorId?.[0]} />
            </div>
          </div>
        </div>

        {/* Date and Time */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4">Schedule</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Date */}
            <div>
              <label htmlFor="date" className="form-label">
                Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className={`input-field ${formErrors.date ? 'border-red-300' : ''}`}
                min={new Date().toISOString().split('T')[0]}
                disabled={isLoading}
              />
              <InlineError message={formErrors.date?.[0]} />
            </div>

            {/* Time */}
            <div>
              <label htmlFor="time" className="form-label">
                Time *
              </label>
              <select
                id="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className={`input-field ${formErrors.time ? 'border-red-300' : ''}`}
                disabled={isLoading}
              >
                <option value="">Select time</option>
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
              <InlineError message={formErrors.time?.[0]} />
            </div>

            {/* Duration */}
            <div>
              <label htmlFor="duration" className="form-label">
                Duration (minutes)
              </label>
              <select
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="input-field"
                disabled={isLoading}
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>1 hour</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reason and Notes */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4">Additional Information</h4>
          
          {/* Reason */}
          <div className="mb-6">
            <label htmlFor="reason" className="form-label">
              Reason for Visit *
            </label>
            <input
              type="text"
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              className={`input-field ${formErrors.reason ? 'border-red-300' : ''}`}
              placeholder="e.g., Regular checkup, Follow-up, Consultation"
              disabled={isLoading}
            />
            <InlineError message={formErrors.reason?.[0]} />
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="form-label">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleInputChange}
              className={`input-field ${formErrors.notes ? 'border-red-300' : ''}`}
              placeholder="Additional notes or special instructions"
              disabled={isLoading}
            />
            <InlineError message={formErrors.notes?.[0]} />
          </div>
        </div>

        {/* Status (for editing) */}
        {appointment && (
          <div>
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="input-field"
              disabled={isLoading}
            >
              <option value="Booked">Booked</option>
              <option value="Completed">Completed</option>
              <option value="Canceled">Canceled</option>
            </select>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="btn-secondary disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary disabled:opacity-50"
          >
            {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
            {isLoading
              ? (appointment ? 'Updating...' : 'Booking...')
              : (appointment ? 'Update Appointment' : 'Book Appointment')
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;