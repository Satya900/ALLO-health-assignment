import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";

// Components
import LoginForm from "./components/auth/LoginForm";
import ProtectedRoute, { PublicRoute } from "./components/auth/ProtectedRoute";
import Layout from "./components/common/Layout";
import StatsCard from "./components/common/StatsCard";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { ToastProvider } from "./components/common/Toast";
import PatientList from "./components/patients/PatientList";
import DoctorList from "./components/doctors/DoctorList";
import AppointmentList from "./components/appointments/AppointmentList";
import QueueManagement from "./components/queue/QueueManagement";
import AdminDashboard from "./components/admin/AdminDashboard";
import Dashboard from "./components/dashboard/Dashboard";

const Patients = () => <PatientList />;

const Doctors = () => <DoctorList />;

const Appointments = () => <AppointmentList />;

const Queue = () => <QueueManagement />;

const Admin = () => <AdminDashboard />;

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ToastProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 m-0 p-0">
              <Routes>
                {/* Public Routes */}
                <Route
                  path="/login"
                  element={
                    <PublicRoute redirectIfAuthenticated={true}>
                      <LoginForm />
                    </PublicRoute>
                  }
                />

                {/* Protected Routes with Layout */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="patients" element={<Patients />} />
                  <Route path="doctors" element={<Doctors />} />
                  <Route path="appointments" element={<Appointments />} />
                  <Route path="queue" element={<Queue />} />
                  <Route path="admin" element={<Admin />} />
                </Route>

                {/* 404 Not Found */}
                <Route
                  path="*"
                  element={
                    <div className="min-h-screen flex items-center justify-center bg-gray-50">
                      <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900">
                          404
                        </h1>
                        <p className="mt-2 text-gray-600">Page not found</p>
                        <button
                          onClick={() => window.history.back()}
                          className="mt-4 btn-primary"
                        >
                          Go Back
                        </button>
                      </div>
                    </div>
                  }
                />
              </Routes>
            </div>
          </Router>
        </ToastProvider>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
