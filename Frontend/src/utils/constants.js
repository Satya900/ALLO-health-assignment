// API Base URL - uses environment variable or defaults to localhost
export const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api`
  : 'http://localhost:8000/api';

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'clinic_auth_token',
  USER_DATA: 'clinic_user_data',
  THEME: 'clinic_theme',
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  FRONTDESK: 'frontdesk',
};

// Appointment Status
export const APPOINTMENT_STATUS = {
  BOOKED: 'Booked',
  COMPLETED: 'Completed',
  CANCELED: 'Canceled',
};

// Queue Status
export const QUEUE_STATUS = {
  WAITING: 'Waiting',
  WITH_DOCTOR: 'With Doctor',
  COMPLETED: 'Completed',
};

// Queue Priority
export const QUEUE_PRIORITY = {
  NORMAL: 'Normal',
  URGENT: 'Urgent',
};

// Gender Options
export const GENDER_OPTIONS = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
];

// Common Specializations
export const SPECIALIZATIONS = [
  'General Medicine',
  'Cardiology',
  'Dermatology',
  'Pediatrics',
  'Orthopedics',
  'Gynecology',
  'Neurology',
  'Psychiatry',
  'Ophthalmology',
  'ENT',
];

// Time Slots (24-hour format)
export const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
];

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
};

// Toast Types
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};