import { useState, useEffect } from 'react';
import { validateForm } from '../../utils/validators';
import { GENDER_OPTIONS } from '../../utils/constants';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage, { InlineError } from '../common/ErrorMessage';

/**
 * Patient form component for creating and editing patients
 */
const PatientForm = ({
  patient = null,
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
    age: '',
    gender: '',
    address: '',
    emergencyContact: '',
    medicalHistory: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with patient data if editing
  useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name || '',
        email: patient.email || '',
        phone: patient.phone || '',
        age: patient.age?.toString() || '',
        gender: patient.gender || '',
        address: patient.address || '',
        emergencyContact: patient.emergencyContact || '',
        medicalHistory: patient.medicalHistory || '',
      });
    }
  }, [patient]);

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
  const validatePatientForm = () => {
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
      age: {
        required: true,
        age: true,
      },
      gender: {
        required: true,
      },
      address: {
        maxLength: 500,
      },
      emergencyContact: {
        phone: true,
      },
      medicalHistory: {
        maxLength: 1000,
      },
    };

    return validateForm(formData, rules);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const validation = validatePatientForm();
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    setFormErrors({});

    try {
      // Convert age to number
      const submitData = {
        ...formData,
        age: parseInt(formData.age, 10),
      };

      const result = await onSubmit(submitData);
      
      // If onSubmit returns a result object, check for success
      if (result && !result.success) {
        setFormErrors({
          general: result.error || 'An error occurred while saving the patient.',
        });
        return;
      }
      
      // If we get here, the submission was successful
      // The parent component will handle closing the modal
    } catch (error) {
      setFormErrors({
        general: error.message || 'An error occurred while saving the patient.',
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

              {/* Age */}
              <div>
                <label htmlFor="age" className="form-label">
                  Age *
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className={`input-field ${formErrors.age ? 'border-red-300' : ''}`}
                  placeholder="Enter age"
                  min="0"
                  max="150"
                  disabled={isLoading}
                />
                <InlineError message={formErrors.age?.[0]} />
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

              {/* Emergency Contact */}
              <div>
                <label htmlFor="emergencyContact" className="form-label">
                  Emergency Contact
                </label>
                <input
                  type="tel"
                  id="emergencyContact"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  className={`input-field ${formErrors.emergencyContact ? 'border-red-300' : ''}`}
                  placeholder="Enter emergency contact number"
                  disabled={isLoading}
                />
                <InlineError message={formErrors.emergencyContact?.[0]} />
              </div>
            </div>

            {/* Address */}
            <div className="mt-6">
              <label htmlFor="address" className="form-label">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                rows={3}
                value={formData.address}
                onChange={handleInputChange}
                className={`input-field ${formErrors.address ? 'border-red-300' : ''}`}
                placeholder="Enter full address"
                disabled={isLoading}
              />
              <InlineError message={formErrors.address?.[0]} />
            </div>
          </div>

          {/* Medical Information */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Medical Information</h4>
            <div>
              <label htmlFor="medicalHistory" className="form-label">
                Medical History
              </label>
              <textarea
                id="medicalHistory"
                name="medicalHistory"
                rows={4}
                value={formData.medicalHistory}
                onChange={handleInputChange}
                className={`input-field ${formErrors.medicalHistory ? 'border-red-300' : ''}`}
                placeholder="Enter relevant medical history, allergies, medications, etc."
                disabled={isLoading}
              />
              <InlineError message={formErrors.medicalHistory?.[0]} />
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
                ? (patient ? 'Updating...' : 'Creating...')
                : (patient ? 'Update Patient' : 'Create Patient')
              }
            </button>
          </div>
      </form>
    </div>
  );
};

export default PatientForm;