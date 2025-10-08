import { useState, useEffect } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

/**
 * SystemSettings component for admin system configuration
 */
const SystemSettings = () => {
  const [settings, setSettings] = useState({
    general: {
      clinicName: 'HealthCare Clinic',
      clinicAddress: '123 Medical Center Dr, Healthcare City, HC 12345',
      clinicPhone: '+1-555-CLINIC',
      clinicEmail: 'info@healthcareclinic.com',
      timezone: 'America/New_York',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12',
    },
    appointments: {
      defaultDuration: 30,
      maxAdvanceBooking: 90,
      allowCancellation: true,
      cancellationDeadline: 24,
      autoConfirmation: true,
      reminderEnabled: true,
      reminderTime: 24,
    },
    queue: {
      maxQueueSize: 50,
      autoAssignment: true,
      priorityEnabled: true,
      estimatedWaitTime: true,
      queueNotifications: true,
    },
    security: {
      sessionTimeout: 60,
      passwordMinLength: 8,
      requireSpecialChars: true,
      maxLoginAttempts: 5,
      lockoutDuration: 30,
      twoFactorAuth: false,
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      appointmentReminders: true,
      systemAlerts: true,
    },
    backup: {
      autoBackup: true,
      backupFrequency: 'daily',
      backupRetention: 30,
      backupLocation: 'cloud',
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeSection, setActiveSection] = useState('general');

  const sections = [
    { key: 'general', label: 'General', icon: '⚙️' },
    { key: 'appointments', label: 'Appointments', icon: '📅' },
    { key: 'queue', label: 'Queue Management', icon: '⏱️' },
    { key: 'security', label: 'Security', icon: '🔒' },
    { key: 'notifications', label: 'Notifications', icon: '🔔' },
    { key: 'backup', label: 'Backup & Recovery', icon: '💾' },
  ];

  const handleSettingChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // In real app, make API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError('Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSection = () => {
    if (window.confirm(`Are you sure you want to reset ${activeSection} settings to default values?`)) {
      // In real app, fetch default settings from API
      setSuccess(`${activeSection} settings reset to defaults`);
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Clinic Name
          </label>
          <input
            type="text"
            value={settings.general.clinicName}
            onChange={(e) => handleSettingChange('general', 'clinicName', e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={settings.general.clinicPhone}
            onChange={(e) => handleSettingChange('general', 'clinicPhone', e.target.value)}
            className="input-field"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address
        </label>
        <textarea
          value={settings.general.clinicAddress}
          onChange={(e) => handleSettingChange('general', 'clinicAddress', e.target.value)}
          rows={3}
          className="input-field"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          type="email"
          value={settings.general.clinicEmail}
          onChange={(e) => handleSettingChange('general', 'clinicEmail', e.target.value)}
          className="input-field"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Timezone
          </label>
          <select
            value={settings.general.timezone}
            onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
            className="input-field"
          >
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Format
          </label>
          <select
            value={settings.general.dateFormat}
            onChange={(e) => handleSettingChange('general', 'dateFormat', e.target.value)}
            className="input-field"
          >
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Format
          </label>
          <select
            value={settings.general.timeFormat}
            onChange={(e) => handleSettingChange('general', 'timeFormat', e.target.value)}
            className="input-field"
          >
            <option value="12">12 Hour</option>
            <option value="24">24 Hour</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderAppointmentSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Default Appointment Duration (minutes)
          </label>
          <input
            type="number"
            min="15"
            max="120"
            value={settings.appointments.defaultDuration}
            onChange={(e) => handleSettingChange('appointments', 'defaultDuration', parseInt(e.target.value))}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maximum Advance Booking (days)
          </label>
          <input
            type="number"
            min="1"
            max="365"
            value={settings.appointments.maxAdvanceBooking}
            onChange={(e) => handleSettingChange('appointments', 'maxAdvanceBooking', parseInt(e.target.value))}
            className="input-field"
          />
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="allowCancellation"
            checked={settings.appointments.allowCancellation}
            onChange={(e) => handleSettingChange('appointments', 'allowCancellation', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="allowCancellation" className="ml-2 text-sm text-gray-700">
            Allow appointment cancellation
          </label>
        </div>
        {settings.appointments.allowCancellation && (
          <div className="ml-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cancellation Deadline (hours before appointment)
            </label>
            <input
              type="number"
              min="1"
              max="72"
              value={settings.appointments.cancellationDeadline}
              onChange={(e) => handleSettingChange('appointments', 'cancellationDeadline', parseInt(e.target.value))}
              className="input-field"
            />
          </div>
        )}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="autoConfirmation"
            checked={settings.appointments.autoConfirmation}
            onChange={(e) => handleSettingChange('appointments', 'autoConfirmation', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="autoConfirmation" className="ml-2 text-sm text-gray-700">
            Auto-confirm appointments
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="reminderEnabled"
            checked={settings.appointments.reminderEnabled}
            onChange={(e) => handleSettingChange('appointments', 'reminderEnabled', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="reminderEnabled" className="ml-2 text-sm text-gray-700">
            Send appointment reminders
          </label>
        </div>
        {settings.appointments.reminderEnabled && (
          <div className="ml-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reminder Time (hours before appointment)
            </label>
            <input
              type="number"
              min="1"
              max="72"
              value={settings.appointments.reminderTime}
              onChange={(e) => handleSettingChange('appointments', 'reminderTime', parseInt(e.target.value))}
              className="input-field"
            />
          </div>
        )}
      </div>
    </div>
  );

  const renderQueueSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maximum Queue Size
          </label>
          <input
            type="number"
            min="10"
            max="100"
            value={settings.queue.maxQueueSize}
            onChange={(e) => handleSettingChange('queue', 'maxQueueSize', parseInt(e.target.value))}
            className="input-field"
          />
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="autoAssignment"
            checked={settings.queue.autoAssignment}
            onChange={(e) => handleSettingChange('queue', 'autoAssignment', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="autoAssignment" className="ml-2 text-sm text-gray-700">
            Auto-assign patients to available doctors
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="priorityEnabled"
            checked={settings.queue.priorityEnabled}
            onChange={(e) => handleSettingChange('queue', 'priorityEnabled', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="priorityEnabled" className="ml-2 text-sm text-gray-700">
            Enable priority queue management
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="estimatedWaitTime"
            checked={settings.queue.estimatedWaitTime}
            onChange={(e) => handleSettingChange('queue', 'estimatedWaitTime', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="estimatedWaitTime" className="ml-2 text-sm text-gray-700">
            Show estimated wait times
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="queueNotifications"
            checked={settings.queue.queueNotifications}
            onChange={(e) => handleSettingChange('queue', 'queueNotifications', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="queueNotifications" className="ml-2 text-sm text-gray-700">
            Send queue status notifications
          </label>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Session Timeout (minutes)
          </label>
          <input
            type="number"
            min="15"
            max="480"
            value={settings.security.sessionTimeout}
            onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password Minimum Length
          </label>
          <input
            type="number"
            min="6"
            max="20"
            value={settings.security.passwordMinLength}
            onChange={(e) => handleSettingChange('security', 'passwordMinLength', parseInt(e.target.value))}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Login Attempts
          </label>
          <input
            type="number"
            min="3"
            max="10"
            value={settings.security.maxLoginAttempts}
            onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lockout Duration (minutes)
          </label>
          <input
            type="number"
            min="5"
            max="120"
            value={settings.security.lockoutDuration}
            onChange={(e) => handleSettingChange('security', 'lockoutDuration', parseInt(e.target.value))}
            className="input-field"
          />
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="requireSpecialChars"
            checked={settings.security.requireSpecialChars}
            onChange={(e) => handleSettingChange('security', 'requireSpecialChars', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="requireSpecialChars" className="ml-2 text-sm text-gray-700">
            Require special characters in passwords
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="twoFactorAuth"
            checked={settings.security.twoFactorAuth}
            onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="twoFactorAuth" className="ml-2 text-sm text-gray-700">
            Enable two-factor authentication
          </label>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="emailNotifications"
            checked={settings.notifications.emailNotifications}
            onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="emailNotifications" className="ml-2 text-sm text-gray-700">
            Email notifications
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="smsNotifications"
            checked={settings.notifications.smsNotifications}
            onChange={(e) => handleSettingChange('notifications', 'smsNotifications', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="smsNotifications" className="ml-2 text-sm text-gray-700">
            SMS notifications
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="pushNotifications"
            checked={settings.notifications.pushNotifications}
            onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="pushNotifications" className="ml-2 text-sm text-gray-700">
            Push notifications
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="appointmentReminders"
            checked={settings.notifications.appointmentReminders}
            onChange={(e) => handleSettingChange('notifications', 'appointmentReminders', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="appointmentReminders" className="ml-2 text-sm text-gray-700">
            Appointment reminders
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="systemAlerts"
            checked={settings.notifications.systemAlerts}
            onChange={(e) => handleSettingChange('notifications', 'systemAlerts', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="systemAlerts" className="ml-2 text-sm text-gray-700">
            System alerts and warnings
          </label>
        </div>
      </div>
    </div>
  );

  const renderBackupSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Backup Frequency
          </label>
          <select
            value={settings.backup.backupFrequency}
            onChange={(e) => handleSettingChange('backup', 'backupFrequency', e.target.value)}
            className="input-field"
          >
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Backup Retention (days)
          </label>
          <input
            type="number"
            min="7"
            max="365"
            value={settings.backup.backupRetention}
            onChange={(e) => handleSettingChange('backup', 'backupRetention', parseInt(e.target.value))}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Backup Location
          </label>
          <select
            value={settings.backup.backupLocation}
            onChange={(e) => handleSettingChange('backup', 'backupLocation', e.target.value)}
            className="input-field"
          >
            <option value="local">Local Storage</option>
            <option value="cloud">Cloud Storage</option>
            <option value="both">Both Local and Cloud</option>
          </select>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="autoBackup"
            checked={settings.backup.autoBackup}
            onChange={(e) => handleSettingChange('backup', 'autoBackup', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="autoBackup" className="ml-2 text-sm text-gray-700">
            Enable automatic backups
          </label>
        </div>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Backup Actions</h4>
        <div className="space-y-2">
          <button className="btn-secondary w-full sm:w-auto">
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Create Backup Now
          </button>
          <button className="btn-secondary w-full sm:w-auto ml-0 sm:ml-3">
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            Restore from Backup
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">System Settings</h2>
          <p className="mt-1 text-sm text-gray-500">
            Configure system-wide settings and preferences
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={handleResetSection}
            className="btn-secondary"
          >
            Reset Section
          </button>
          <button
            onClick={handleSaveSettings}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Saving...
              </>
            ) : (
              'Save Settings'
            )}
          </button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="ml-3">
              <p className="text-sm text-green-800">{success}</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <ErrorMessage
          message={error}
          type="error"
          dismissible
          onDismiss={() => setError(null)}
          onRetry={handleSaveSettings}
        />
      )}

      {/* Settings Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {sections.map((section) => (
            <button
              key={section.key}
              onClick={() => setActiveSection(section.key)}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeSection === section.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{section.icon}</span>
              {section.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Settings Content */}
      <div className="bg-white shadow rounded-lg p-6">
        {activeSection === 'general' && renderGeneralSettings()}
        {activeSection === 'appointments' && renderAppointmentSettings()}
        {activeSection === 'queue' && renderQueueSettings()}
        {activeSection === 'security' && renderSecuritySettings()}
        {activeSection === 'notifications' && renderNotificationSettings()}
        {activeSection === 'backup' && renderBackupSettings()}
      </div>
    </div>
  );
};

export default SystemSettings;