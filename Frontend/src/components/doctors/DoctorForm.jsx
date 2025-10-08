import { useState, useEffect } from 'react';
import { validateForm } from '../../utils/validators';
import { GENDER_OPTIONS, SPECIALIZATIONS } from '../../utils/constants';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage, { InlineError } from '../common/ErrorMessage';

/**
 * Doctor form component for creating and editing doctors
 */
const DoctorForm = ({
  doctor = null,
  onSubmit,
  onCancel,
  loading = false,
  error = null,
}) => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    gender: '',
    location: '',
    availableSlots: [],
    isActive: true,
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available time slots
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  ];

  // Initialize form with doctor data if editing
  useEffect(() => {
    if (doctor) {
      setFormData({
        name: doctor.name || '',
        email: doctor.email || '',
        phone: doctor.phone || '',
        specialization: doctor.specialization || '',
        gender: doctor.gender || '',
        location: doctor.location || '',
        availableSlots: doctor.availableSlots || [],
        isActive: doctor.isActive !== undefined ? doctor.isActive : true,
      });
    }
  }, [doctor]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  // Handle time slot selection
  const handleTimeSlotChange = (slot) => {
    setFormData(prev => ({
      ...prev,
      availableSlots: prev.availableSlots.includes(slot)
        ? prev.availableSlots.filter(s => s !== slot)
        : [...prev.availableSlots, slot].sort(),
    }));
  };

  // Validate form
  const validateDoctorForm = () => {
    const rules = {
      name: {
        required: true,
        minLength: 2,
        maxLength: 100,
      },
      email: {
        required: true,
        email: true,
      },
      phone: {
        required: true,
        phone: true,
      },
      specialization: {
        required: true,
      },
      gender: {
        required: true,
      },
      location: {
        required: true,
        maxLength: 200,
      },
    };

    return validateForm(formData, rules);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const validation = validateDoctorForm();
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
          general: result.error || 'An error occurred while saving the doctor.',
        });
        return;
      }
      
      // If we get here, the submission was successful
      // The parent component will handle closing the modal
    } catch (error) {
      setFormErrors({
        general: error.message || 'An error occurred while saving the doctor.',
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

        {/* Personal Information */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4">Personal Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="form-label">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`input-field ${formErrors.name ? 'border-red-300' : ''}`}
                placeholder="Enter full name"
                disabled={isLoading}
              />
              <InlineError message={formErrors.name?.[0]} />
            </div>

            {/* Gender */}
            <div>
              <label htmlFor="gender" className="form-label">
                Gender *
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className={`input-field ${formErrors.gender ? 'border-red-300' : ''}`}
                disabled={isLoading}
              >
                <option value="">Select gender</option>
                {GENDER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <InlineError message={formErrors.gender?.[0]} />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4">Contact Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="form-label">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`input-field ${formErrors.email ? 'border-red-300' : ''}`}
                placeholder="Enter email address"
                disabled={isLoading}
              />
              <InlineError message={formErrors.email?.[0]} />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="form-label">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`input-field ${formErrors.phone ? 'border-red-300' : ''}`}
                placeholder="Enter phone number"
                disabled={isLoading}
              />
              <InlineError message={formErrors.phone?.[0]} />
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4">Professional Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Specialization */}
            <div>
              <label htmlFor="specialization" className="form-label">
                Specialization *
              </label>
              <select
                id="specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                className={`input-field ${formErrors.specialization ? 'border-red-300' : ''}`}
                disabled={isLoading}
              >
                <option value="">Select specialization</option>
                {SPECIALIZATIONS.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
              <InlineError message={formErrors.specialization?.[0]} />
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="form-label">
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className={`input-field ${formErrors.location ? 'border-red-300' : ''}`}
                placeholder="Enter clinic location"
                disabled={isLoading}
              />
              <InlineError message={formErrors.location?.[0]} />
            </div>
          </div>
        </div>

        {/* Available Time Slots */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4">Available Time Slots</h4>
          <p className="text-sm text-gray-500 mb-4">
            Select the time slots when this doctor is available for appointments
          </p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {timeSlots.map((slot) => (
              <label
                key={slot}
                className={`flex items-center justify-center p-2 border rounded-md cursor-pointer transition-colors ${
                  formData.availableSlots.includes(slot)
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={formData.availableSlots.includes(slot)}
                  onChange={() => handleTimeSlotChange(slot)}
                  disabled={isLoading}
                />
                <span className="text-sm font-medium">{slot}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              disabled={isLoading}
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              Doctor is on duty and available for appointments
            </label>
          </div>
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
              ? (doctor ? 'Updating...' : 'Creating...')
              : (doctor ? 'Update Doctor' : 'Create Doctor')
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default DoctorForm;