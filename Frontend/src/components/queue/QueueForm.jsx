import { useState, useEffect } from 'react';
import { validateForm } from '../../utils/validators';
import { QUEUE_STATUS, QUEUE_PRIORITY } from '../../utils/constants';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage, { InlineError } from '../common/ErrorMessage';

/**
 * Queue form component for adding patients to queue
 */
const QueueForm = ({
  queueItem = null,
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
    priority: 'Normal',
    notes: '',
    status: 'Waiting',
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with queue data if editing
  useEffect(() => {
    if (queueItem) {
      setFormData({
        patientId: queueItem.patientId || queueItem.patient?._id || '',
        doctorId: queueItem.doctorId || queueItem.doctor?._id || '',
        priority: queueItem.priority || 'Normal',
        notes: queueItem.notes || '',
        status: queueItem.status || 'Waiting',
      });
    }
  }, [queueItem]);

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
  const validateQueueForm = () => {
    const rules = {
      patientId: {
        required: true,
      },
      doctorId: {
        required: true,
      },
      priority: {
        required: true,
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
    const validation = validateQueueForm();
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
          general: result.error || 'An error occurred while adding to queue.',
        });
        return;
      }
      
      // If we get here, the submission was successful
      // The parent component will handle closing the modal
    } catch (error) {
      setFormErrors({
        general: error.message || 'An error occurred while adding to queue.',
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
          <h4 className="text-md font-medium text-gray-900 mb-4">Queue Details</h4>
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

        {/* Priority and Status */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4">Queue Settings</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Priority */}
            <div>
              <label htmlFor="priority" className="form-label">
                Priority *
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className={`input-field ${formErrors.priority ? 'border-red-300' : ''}`}
                disabled={isLoading}
              >
                <option value="Normal">Normal</option>
                <option value="Urgent">Urgent</option>
              </select>
              <InlineError message={formErrors.priority?.[0]} />
            </div>

            {/* Status (for editing) */}
            {queueItem && (
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
                  <option value="Waiting">Waiting</option>
                  <option value="With Doctor">With Doctor</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            )}
          </div>
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
              ? (queueItem ? 'Updating...' : 'Adding...')
              : (queueItem ? 'Update Queue' : 'Add to Queue')
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default QueueForm;