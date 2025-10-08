import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useDashboard } from '../../hooks/useDashboard';
import { formatDate, formatTime } from '../../utils/helpers';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import StatsCard from '../common/StatsCard';
import UserManagement from './UserManagement';
import SystemSettings from './SystemSettings';
import ReportsOverview from './ReportsOverview';

/**
 * Admin Dashboard component with system management features
 */
const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [systemAlerts, setSystemAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock system health data
  const [systemHealth] = useState({
    score: 95,
    status: 'Excellent',
    issues: [],
    lastCheck: new Date(),
  });

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      console.warn('Access denied: Admin privileges required');
    }
  }, [isAdmin]);

  // Mock system alerts
  useEffect(() => {
    const alerts = [
      {
        id: 1,
        type: 'warning',
        title: 'Database Performance',
        message: 'Query response time is above normal threshold',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        severity: 'medium',
      },
      {
        id: 2,
        type: 'info',
        title: 'Backup Completed',
        message: 'Daily backup completed successfully',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        severity: 'low',
      },
      {
        id: 3,
        type: 'error',
        title: 'Failed Login Attempts',
        message: '5 failed login attempts detected from IP 192.168.1.100',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        severity: 'high',
      },
    ];
    setSystemAlerts(alerts);
  }, []);

  const tabs = [
    { key: 'overview', label: 'Overview', icon: '📊' },
    { key: 'users', label: 'User Management', icon: '👥' },
    { key: 'settings', label: 'System Settings', icon: '⚙️' },
    { key: 'reports', label: 'Reports', icon: '📈' },
  ];

  const getSystemStats = () => {
    return [
      {
        title: 'Total Users',
        value: '24',
        subtitle: '3 active sessions',
        trend: 'up',
        trendValue: '+2 this week',
        color: 'blue',
        icon: (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        ),
      },
      {
        title: 'System Health',
        value: `${systemHealth.score}%`,
        subtitle: systemHealth.status,
        trend: systemHealth.score >= 90 ? 'up' : systemHealth.score >= 70 ? 'neutral' : 'down',
        trendValue: `${systemHealth.issues.length} issues`,
        color: systemHealth.score >= 90 ? 'green' : systemHealth.score >= 70 ? 'yellow' : 'red',
        icon: (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      },
      {
        title: 'Data Storage',
        value: '2.4 GB',
        subtitle: 'of 10 GB used',
        trend: 'neutral',
        trendValue: '24% capacity',
        color: 'purple',
        icon: (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
          </svg>
        ),
      },
      {
        title: 'API Requests',
        value: '1,247',
        subtitle: 'today',
        trend: 'up',
        trendValue: '+15% vs yesterday',
        color: 'indigo',
        icon: (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        ),
      },
    ];
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'error':
        return (
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        );
      case 'info':
        return (
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const getAlertBgColor = (type) => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const systemStats = getSystemStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            System administration and management console
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <button
            onClick={() => window.location.reload()}
            className="btn-secondary"
          >
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <ErrorMessage
          message={error}
          type="error"
          dismissible
          onDismiss={() => setError(null)}
        />
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* System Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {systemStats.map((stat, index) => (
              <StatsCard
                key={index}
                title={stat.title}
                value={stat.value}
                subtitle={stat.subtitle}
                trend={stat.trend}
                trendValue={stat.trendValue}
                color={stat.color}
                icon={stat.icon}
              />
            ))}
          </div>

          {/* System Alerts */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">System Alerts</h3>
              <p className="mt-1 text-sm text-gray-500">
                Recent system notifications and alerts
              </p>
            </div>
            <div className="p-6">
              {systemAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No alerts</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    All systems are running normally
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {systemAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`border rounded-lg p-4 ${getAlertBgColor(alert.type)}`}
                    >
                      <div className="flex">
                        {getAlertIcon(alert.type)}
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-900">
                              {alert.title}
                            </h4>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                              alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {alert.severity}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-gray-700">
                            {alert.message}
                          </p>
                          <p className="mt-2 text-xs text-gray-500">
                            {formatTime ? formatTime(alert.timestamp) : alert.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && <UserManagement />}
      {activeTab === 'settings' && <SystemSettings />}
      {activeTab === 'reports' && <ReportsOverview />}
    </div>
  );
};

export default AdminDashboard;