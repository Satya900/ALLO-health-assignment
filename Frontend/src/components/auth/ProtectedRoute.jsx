import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import LoadingSpinner from "../common/LoadingSpinner";

/**
 * ProtectedRoute component that handles authentication and authorization
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {string|string[]} props.roles - Required role(s) to access the route
 * @param {boolean} props.requireAuth - Whether authentication is required (default: true)
 * @param {string} props.redirectTo - Where to redirect if not authorized (default: '/login')
 */
const ProtectedRoute = ({
  children,
  roles = null,
  requireAuth = true,
  redirectTo = "/login",
}) => {
  const { isAuthenticated, user, loading, isVerifyingToken } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading || isVerifyingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Check if authentication is required
  if (requireAuth && !isAuthenticated) {
    // Redirect to login with the current location
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role-based authorization
  if (roles && isAuthenticated) {
    const userRole = user?.role;
    const requiredRoles = Array.isArray(roles) ? roles : [roles];

    if (!userRole || !requiredRoles.includes(userRole)) {
      // User doesn't have required role
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md mx-auto">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              Access Denied
            </h2>
            <p className="mt-2 text-gray-600">
              You don't have permission to access this page.
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Required role(s): {requiredRoles.join(", ")}
            </p>
            <p className="text-sm text-gray-500">
              Your role: {userRole || "None"}
            </p>
            <div className="mt-6">
              <button
                onClick={() => window.history.back()}
                className="btn-secondary mr-3"
              >
                Go Back
              </button>
              <Navigate to="/dashboard" className="btn-primary">
                Go to Dashboard
              </Navigate>
            </div>
          </div>
        </div>
      );
    }
  }

  // User is authenticated and authorized, render children
  return children;
};

/**
 * Higher-order component for protecting routes
 * @param {React.Component} Component - Component to protect
 * @param {Object} options - Protection options
 * @returns {React.Component} Protected component
 */
export const withAuth = (Component, options = {}) => {
  return function ProtectedComponent(props) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
};

/**
 * Component for admin-only routes
 */
export const AdminRoute = ({ children }) => {
  return <ProtectedRoute roles={["admin"]}>{children}</ProtectedRoute>;
};

/**
 * Component for front desk staff routes
 */
export const FrontDeskRoute = ({ children }) => {
  return (
    <ProtectedRoute roles={["frontdesk", "admin"]}>{children}</ProtectedRoute>
  );
};

/**
 * Component for public routes (no authentication required)
 */
export const PublicRoute = ({
  children,
  redirectIfAuthenticated = false,
  redirectTo = "/dashboard",
}) => {
  const { isAuthenticated, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Redirect authenticated users if specified
  if (redirectIfAuthenticated && isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default ProtectedRoute;
