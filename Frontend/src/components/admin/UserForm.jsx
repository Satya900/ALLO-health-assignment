import { useState, useEffect } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { validateForm } from '../../utils/validators';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage, { InlineError } from '../common/ErrorMessage';

/**
 * UserForm component for creating and editing users
 */
const UserForm = ({ user = null, onClose, onSuccess }) => {
  const { createUser, updateUser, isCreating, isUpdating } = useAdmin();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'frontdesk',
    status: 'active',
    phone: '',
    department: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Initialize form with user data if editing
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '', // Don't populate password for editing
        confirmPassword: '',
        role: user.role || 'frontdesk',
        status: user.status || 'active',
        phone: user.phone || '',
        department: user.department || '',
      });
    }
  }, [user]);

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
  const validateUserForm = () => {
    const rules = {
      name: {
        required: true,
        minLength: 2,
        maxLength: 50,
      },
      email: {
        required: true,
        email: true,
      },
      role: {
        required: true,
        in: ['admin', 'frontdesk', 'doctor'],
      },
      status: {
        required: true,
        in: ['active', 'inactive'],
      },
      phone: {
        phone: true,
      },
    };

    // Add password validation for new users
    if (!user) {
      rules.password = {
        required: true,
        minLength: 8,
        password: true,
      };
      rules.confirmPassword = {
        required: true,
        matches: formData.password,
      };
    } else if (formData.password) {
      // If editing and password is provided, validate it
      rules.password = {
        minLength: 8,
        password: true,
      };
      rules.confirmPassword = {
        matches: formData.password,
      };
    }

    return validateForm(formData, rules);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const validation = validateUserForm();
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    setFormErrors({});

    try {
      const userData = { ...formData };
      
      // Remove confirmPassword from submission
      delete userData.confirmPassword;
      
      // Don't send empty password for updates
      if (user && !userData.password) {
        delete userData.password;
      }

      let result;
      if (user) {
        result = await updateUser(user._id, userData);
      } else {
        result = await createUser(userData);
      }

      if (result.success) {
        onSuccess();
      } else {
        setFormErrors({
          general: result.error,
        });
      }
    } catch (error) {
      setFormErrors({
        general: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isLoading = isCreating || isUpdating || isSubmitting;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              {user ? 'Edit User' : 'Create New User'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Error */}
            {formErrors.general && (
              <ErrorMessage
                message={formErrors.general}
                type="error"
              />
            )}

            {/* Basic Information */}
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
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Password */}
              <div>
                <label htmlFor="password" className="form-label">
                  Password {!user && '*'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`input-field pr-10 ${formErrors.password ? 'border-red-300' : ''}`}
                    placeholder={user ? 'Leave blank to keep current password' : 'Enter password'}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={togglePasswordVisibility}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                <InlineError message={formErrors.password?.[0]} />
                {!user && (
                  <p className="mt-1 text-xs text-gray-500">
                    Password must be at least 8 characters with uppercase, lowercase, number, and special character
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password {!user && '*'}
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`input-field ${formErrors.confirmPassword ? 'border-red-300' : ''}`}
                  placeholder="Confirm password"
                  disabled={isLoading}
                />
                <InlineError message={formErrors.confirmPassword?.[0]} />
              </div>
            </div>

            {/* Role and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Role */}
              <div>
                <label htmlFor="role" className="form-label">
                  Role *
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className={`input-field ${formErrors.role ? 'border-red-300' : ''}`}
                  disabled={isLoading}
                >
                  <option value="frontdesk">Front Desk</option>
                  <option value="doctor">Doctor</option>
                  <option value="admin">Administrator</option>
                </select>
                <InlineError message={formErrors.role?.[0]} />
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="form-label">
                  Status *
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className={`input-field ${formErrors.status ? 'border-red-300' : ''}`}
                  disabled={isLoading}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <InlineError message={formErrors.status?.[0]} />
              </div>
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Phone */}
              <div>
                <label htmlFor="phone" className="form-label">
                  Phone Number
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

              {/* Department */}
              <div>
                <label htmlFor="department" className="form-label">
                  Department
                </label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter department"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Role Description */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Role Permissions</h4>
              <div className="text-sm text-gray-600">
                {formData.role === 'admin' && (
                  <p>Full system access including user management, reports, and system settings.</p>
                )}
                {formData.role === 'frontdesk' && (
                  <p>Access to patient management, appointment booking, and queue management.</p>
                )}
                {formData.role === 'doctor' && (
                  <p>Access to patient records, appointments, and queue for assigned patients.</p>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
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
                  ? (user ? 'Updating...' : 'Creating...')
                  : (user ? 'Update User' : 'Create User')
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserForm;