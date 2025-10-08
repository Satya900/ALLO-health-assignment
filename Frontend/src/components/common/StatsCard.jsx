import LoadingSpinner from './LoadingSpinner';

/**
 * StatsCard component for displaying dashboard metrics
 * @param {Object} props
 * @param {string} props.title - Card title
 * @param {string|number} props.value - Main metric value
 * @param {string} props.subtitle - Optional subtitle
 * @param {React.ReactNode} props.icon - Icon component
 * @param {string} props.trend - Trend indicator: 'up', 'down', 'neutral'
 * @param {string|number} props.trendValue - Trend percentage or value
 * @param {string} props.color - Color theme: 'blue', 'green', 'yellow', 'red', 'purple', 'gray'
 * @param {boolean} props.loading - Loading state
 * @param {Function} props.onClick - Click handler
 * @param {string} props.className - Additional CSS classes
 */
const StatsCard = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  color = 'blue',
  loading = false,
  onClick,
  className = '',
}) => {
  // Color themes
  const colorThemes = {
    blue: {
      bg: 'bg-blue-50',
      iconBg: 'bg-blue-500',
      text: 'text-blue-600',
      hover: 'hover:bg-blue-100',
    },
    green: {
      bg: 'bg-green-50',
      iconBg: 'bg-green-500',
      text: 'text-green-600',
      hover: 'hover:bg-green-100',
    },
    yellow: {
      bg: 'bg-yellow-50',
      iconBg: 'bg-yellow-500',
      text: 'text-yellow-600',
      hover: 'hover:bg-yellow-100',
    },
    red: {
      bg: 'bg-red-50',
      iconBg: 'bg-red-500',
      text: 'text-red-600',
      hover: 'hover:bg-red-100',
    },
    purple: {
      bg: 'bg-purple-50',
      iconBg: 'bg-purple-500',
      text: 'text-purple-600',
      hover: 'hover:bg-purple-100',
    },
    gray: {
      bg: 'bg-gray-50',
      iconBg: 'bg-gray-500',
      text: 'text-gray-600',
      hover: 'hover:bg-gray-100',
    },
  };

  const theme = colorThemes[color];

  // Trend styles
  const trendStyles = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-500',
  };

  // Trend icons
  const trendIcons = {
    up: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 17l9.2-9.2M17 17V7H7"
        />
      </svg>
    ),
    down: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 7l-9.2 9.2M7 7v10h10"
        />
      </svg>
    ),
    neutral: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 12h8"
        />
      </svg>
    ),
  };

  const cardClasses = `
    stats-card relative overflow-hidden
    ${onClick ? `cursor-pointer ${theme.hover}` : ''}
    ${className}
  `.trim();

  const handleClick = () => {
    if (onClick && !loading) {
      onClick();
    }
  };

  return (
    <div className={cardClasses} onClick={handleClick}>
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {icon && (
              <div className={`inline-flex items-center justify-center p-3 ${theme.iconBg} rounded-xl shadow-lg transform transition-transform duration-200 hover:scale-110`}>
                <div className="h-6 w-6 text-white">
                  {icon}
                </div>
              </div>
            )}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="flex items-baseline">
                {loading ? (
                  <div className="flex items-center">
                    <LoadingSpinner size="sm" className="mr-2" />
                    <span className="text-gray-400">Loading...</span>
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-semibold text-gray-900">
                      {value}
                    </div>
                    {trend && trendValue && (
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${trendStyles[trend]}`}>
                        {trendIcons[trend]}
                        <span className="ml-1">
                          {trendValue}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </dd>
              {subtitle && !loading && (
                <dd className="mt-1 text-sm text-gray-600">
                  {subtitle}
                </dd>
              )}
            </dl>
          </div>
        </div>
      </div>
      
      {/* Click indicator */}
      {onClick && !loading && (
        <div className="absolute top-4 right-4">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

/**
 * Simple stats card without icon
 */
export const SimpleStatsCard = ({ title, value, subtitle, loading, className = '' }) => {
  return (
    <div className={`bg-white overflow-hidden shadow rounded-lg ${className}`}>
      <div className="px-4 py-5 sm:p-6">
        <dt className="text-sm font-medium text-gray-500 truncate">
          {title}
        </dt>
        <dd className="mt-1 text-3xl font-semibold text-gray-900">
          {loading ? (
            <div className="flex items-center">
              <LoadingSpinner size="sm" className="mr-2" />
              <span className="text-gray-400 text-base">Loading...</span>
            </div>
          ) : (
            value
          )}
        </dd>
        {subtitle && !loading && (
          <dd className="mt-1 text-sm text-gray-600">
            {subtitle}
          </dd>
        )}
      </div>
    </div>
  );
};

/**
 * Stats card with progress bar
 */
export const ProgressStatsCard = ({ 
  title, 
  value, 
  total, 
  percentage, 
  color = 'blue', 
  loading,
  className = '' 
}) => {
  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    yellow: 'bg-yellow-600',
    red: 'bg-red-600',
    purple: 'bg-purple-600',
  };

  const progressColor = colorClasses[color];

  return (
    <div className={`bg-white overflow-hidden shadow rounded-lg ${className}`}>
      <div className="px-4 py-5 sm:p-6">
        <dt className="text-sm font-medium text-gray-500 truncate">
          {title}
        </dt>
        <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
          <div className="flex items-baseline text-2xl font-semibold text-gray-900">
            {loading ? (
              <div className="flex items-center">
                <LoadingSpinner size="sm" className="mr-2" />
                <span className="text-gray-400 text-base">Loading...</span>
              </div>
            ) : (
              <>
                {value}
                {total && (
                  <span className="ml-2 text-sm font-medium text-gray-500">
                    of {total}
                  </span>
                )}
              </>
            )}
          </div>
          {!loading && percentage !== undefined && (
            <div className="inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800 md:mt-2 lg:mt-0">
              {percentage}%
            </div>
          )}
        </dd>
        {!loading && percentage !== undefined && (
          <div className="mt-3">
            <div className="bg-gray-200 rounded-full h-2">
              <div
                className={`${progressColor} h-2 rounded-full transition-all duration-300`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Compact stats card for smaller spaces
 */
export const CompactStatsCard = ({ title, value, icon, color = 'blue', loading, className = '' }) => {
  const colorThemes = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    red: 'text-red-600',
    purple: 'text-purple-600',
  };

  return (
    <div className={`bg-white p-4 rounded-lg shadow ${className}`}>
      <div className="flex items-center">
        {icon && (
          <div className={`flex-shrink-0 ${colorThemes[color]}`}>
            {icon}
          </div>
        )}
        <div className={`${icon ? 'ml-3' : ''} flex-1 min-w-0`}>
          <p className="text-sm font-medium text-gray-500 truncate">
            {title}
          </p>
          <p className="text-lg font-semibold text-gray-900">
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              value
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;