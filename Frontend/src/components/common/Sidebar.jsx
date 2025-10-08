import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * Sidebar navigation component
 */
const Sidebar = ({ isOpen, onClose }) => {
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  // Navigation items
  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"
          />
        </svg>
      ),
      roles: ['admin', 'frontdesk'],
    },
    {
      name: 'Patients',
      href: '/patients',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      ),
      roles: ['admin', 'frontdesk'],
    },
    {
      name: 'Doctors',
      href: '/doctors',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
      roles: ['admin', 'frontdesk'],
    },
    {
      name: 'Appointments',
      href: '/appointments',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      roles: ['admin', 'frontdesk'],
    },
    {
      name: 'Queue Management',
      href: '/queue',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m0 0h2m-2 0v4a2 2 0 002 2h2a2 2 0 002-2v-4m0 0h2a2 2 0 002-2V7a2 2 0 00-2-2h-2m-4 0V3a2 2 0 00-2-2H9a2 2 0 00-2 2v2m4 0h2"
          />
        </svg>
      ),
      roles: ['admin', 'frontdesk'],
    },
  ];

  // Admin-only items
  const adminItems = [
    {
      name: 'Admin Dashboard',
      href: '/admin',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      roles: ['admin'],
    },
  ];

  // Filter navigation items based on user role
  const filteredNavItems = navigationItems.filter(item =>
    item.roles.includes(user?.role)
  );

  const filteredAdminItems = isAdmin() ? adminItems : [];

  // Check if a navigation item is active
  const isActive = (href) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  // Handle navigation item click (close mobile sidebar)
  const handleNavClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0 px-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 medical-gradient rounded-xl flex items-center justify-center shadow-lg">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-lg font-bold text-blue-600">
                    ClinicDesk
                  </p>
                  <p className="text-xs text-gray-500">Front Desk System</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-5 flex-grow flex flex-col">
              <nav className="flex-1 px-2 space-y-1">
                {/* Main navigation */}
                {filteredNavItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                        isActive
                          ? 'bg-blue-100 text-blue-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`
                    }
                    onClick={handleNavClick}
                  >
                    <span
                      className={`mr-3 flex-shrink-0 ${
                        isActive(item.href) ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    >
                      {item.icon}
                    </span>
                    {item.name}
                  </NavLink>
                ))}

                {/* Admin section */}
                {filteredAdminItems.length > 0 && (
                  <>
                    <div className="mt-8">
                      <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Administration
                      </h3>
                      <div className="mt-2 space-y-1">
                        {filteredAdminItems.map((item) => (
                          <NavLink
                            key={item.name}
                            to={item.href}
                            className={({ isActive }) =>
                              `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                                isActive
                                  ? 'bg-blue-100 text-blue-900'
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                              }`
                            }
                            onClick={handleNavClick}
                          >
                            <span
                              className={`mr-3 flex-shrink-0 ${
                                isActive(item.href) ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                              }`}
                            >
                              {item.icon}
                            </span>
                            {item.name}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile header */}
          <div className="flex items-center justify-between flex-shrink-0 px-4 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <span className="ml-3 text-sm font-medium text-gray-900">
                Clinic System
              </span>
            </div>
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={onClose}
            >
              <span className="sr-only">Close sidebar</span>
              <svg
                className="h-6 w-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Mobile navigation */}
          <div className="flex-1 overflow-y-auto">
            <nav className="px-2 py-4 space-y-1">
              {/* Main navigation */}
              {filteredNavItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors duration-200 ${
                      isActive
                        ? 'bg-blue-100 text-blue-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                  onClick={handleNavClick}
                >
                  <span
                    className={`mr-4 flex-shrink-0 ${
                      isActive(item.href) ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  >
                    {item.icon}
                  </span>
                  {item.name}
                </NavLink>
              ))}

              {/* Admin section */}
              {filteredAdminItems.length > 0 && (
                <>
                  <div className="mt-8">
                    <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Administration
                    </h3>
                    <div className="mt-2 space-y-1">
                      {filteredAdminItems.map((item) => (
                        <NavLink
                          key={item.name}
                          to={item.href}
                          className={({ isActive }) =>
                            `group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors duration-200 ${
                              isActive
                                ? 'bg-blue-100 text-blue-900'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`
                          }
                          onClick={handleNavClick}
                        >
                          <span
                            className={`mr-4 flex-shrink-0 ${
                              isActive(item.href) ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                            }`}
                          >
                            {item.icon}
                          </span>
                          {item.name}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;