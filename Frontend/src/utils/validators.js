/**
 * Validation utility functions
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid phone
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return phoneRegex.test(phone);
};

/**
 * Validate required field
 * @param {any} value - Value to validate
 * @returns {boolean} True if not empty
 */
export const isRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined && value !== '';
};

/**
 * Validate minimum length
 * @param {string} value - Value to validate
 * @param {number} minLength - Minimum length required
 * @returns {boolean} True if meets minimum length
 */
export const hasMinLength = (value, minLength) => {
  return value && value.length >= minLength;
};

/**
 * Validate maximum length
 * @param {string} value - Value to validate
 * @param {number} maxLength - Maximum length allowed
 * @returns {boolean} True if within maximum length
 */
export const hasMaxLength = (value, maxLength) => {
  return !value || value.length <= maxLength;
};

/**
 * Validate age range
 * @param {number} age - Age to validate
 * @param {number} min - Minimum age (default: 0)
 * @param {number} max - Maximum age (default: 150)
 * @returns {boolean} True if within age range
 */
export const isValidAge = (age, min = 0, max = 150) => {
  const numAge = parseInt(age, 10);
  return !isNaN(numAge) && numAge >= min && numAge <= max;
};

/**
 * Validate date format and range
 * @param {string} date - Date to validate
 * @param {boolean} futureOnly - Only allow future dates
 * @returns {boolean} True if valid date
 */
export const isValidDate = (date, futureOnly = false) => {
  if (!date) return false;
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return false;
  
  if (futureOnly) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dateObj >= today;
  }
  
  return true;
};

/**
 * Validate time format (HH:MM)
 * @param {string} time - Time to validate
 * @returns {boolean} True if valid time format
 */
export const isValidTime = (time) => {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} Validation result with strength and errors
 */
export const validatePassword = (password) => {
  const errors = [];
  let strength = 0;
  
  if (!password) {
    return { isValid: false, strength: 0, errors: ['Password is required'] };
  }
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  } else {
    strength += 1;
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  } else {
    strength += 1;
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  } else {
    strength += 1;
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  } else {
    strength += 1;
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  } else {
    strength += 1;
  }
  
  return {
    isValid: errors.length === 0,
    strength,
    errors,
  };
};

/**
 * Form validation helper
 * @param {object} data - Form data to validate
 * @param {object} rules - Validation rules
 * @returns {object} Validation result with errors
 */
export const validateForm = (data, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const value = data[field];
    const fieldRules = rules[field];
    const fieldErrors = [];
    
    // Required validation
    if (fieldRules.required && !isRequired(value)) {
      fieldErrors.push(`${field} is required`);
    }
    
    // Skip other validations if field is empty and not required
    if (!isRequired(value) && !fieldRules.required) {
      return;
    }
    
    // Email validation
    if (fieldRules.email && !isValidEmail(value)) {
      fieldErrors.push('Please enter a valid email address');
    }
    
    // Phone validation
    if (fieldRules.phone && !isValidPhone(value)) {
      fieldErrors.push('Please enter a valid phone number');
    }
    
    // Min length validation
    if (fieldRules.minLength && !hasMinLength(value, fieldRules.minLength)) {
      fieldErrors.push(`${field} must be at least ${fieldRules.minLength} characters`);
    }
    
    // Max length validation
    if (fieldRules.maxLength && !hasMaxLength(value, fieldRules.maxLength)) {
      fieldErrors.push(`${field} must not exceed ${fieldRules.maxLength} characters`);
    }
    
    // Age validation
    if (fieldRules.age && !isValidAge(value)) {
      fieldErrors.push('Please enter a valid age');
    }
    
    // Date validation
    if (fieldRules.date && !isValidDate(value, fieldRules.futureOnly)) {
      fieldErrors.push('Please enter a valid date');
    }
    
    // Time validation
    if (fieldRules.time && !isValidTime(value)) {
      fieldErrors.push('Please enter a valid time (HH:MM)');
    }
    
    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors;
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};