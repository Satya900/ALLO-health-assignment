import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * QuickActions component for common operations
 */
const QuickActions = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isFrontDesk } = useAuth();

  const actions = [
    {
      title: 'Book Appointment',
      description: 'Schedule a new patient appointment',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'bg-blue-500 hover:bg-blue-600',
      onClick: () => navigate('/appointments/new'),
      roles: ['admin', 'frontdesk'],
    },
    {
      title: 'Add Patient',
      description: 'Register a new patient',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
      color: 'bg-green-500 hover:bg-green-600',
      onClick: () => navigate('/patients/new'),
      roles: ['admin', 'frontdesk'],
    },
    {
      title: 'Manage Queue',
      description: 'View and manage patient queue',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m0 0h2m-2 0v4a2 2 0 002 2h2a2 2 0 002-2v-4m0 0h2a2 2 0 002-2V7a2 2 0 00-2-2h-2m-4 0V3a2 2 0 00-2-2H9a2 2 0 00-2 2v2m4 0h2" />
        </svg>
      ),
      color: 'bg-yellow-500 hover:bg-yellow-600',
      onClick: () => navigate('/queue'),
      roles: ['admin', 'frontdesk'],
    },
    {
      title: 'View Reports',
      description: 'Access clinic reports and analytics',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'bg-purple-500 hover:bg-purple-600',
      onClick: () => navigate('/admin/reports'),
      roles: ['admin'],
    },
    {
      title: 'Manage Users',
      description: 'Add or edit system users',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      color: 'bg-red-500 hover:bg-red-600',
      onClick: () => navigate('/admin/users'),
      roles: ['admin'],
    },
    {
      title: 'View Patients',
      description: 'Browse patient records',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'bg-indigo-500 hover:bg-indigo-600',
      onClick: () => navigate('/patients'),
      roles: ['admin', 'frontdesk'],
    },
  ];

  // Filter actions based on user role
  const filteredActions = actions.filter(action => 
    action.roles.includes(user?.role)
  );

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
        <p className="mt-1 text-sm text-gray-500">
          Common tasks and shortcuts
        </p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 gap-4">
          {filteredActions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={`${action.color} text-white rounded-lg p-4 text-left transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {action.icon}
                </div>
                <div className="ml-3 flex-1">
                  <h4 className="text-sm font-medium">{action.title}</h4>
                  <p className="mt-1 text-xs opacity-90">{action.description}</p>
                </div>
                <div className="flex-shrink-0 ml-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;