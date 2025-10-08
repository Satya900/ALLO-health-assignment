import { useEffect, useState } from 'react';
import { usePatients } from '../../hooks/usePatients';
import { useDoctors } from '../../hooks/useDoctors';
import { useAppointments } from '../../hooks/useAppointments';
import { useQueue } from '../../hooks/useQueue';
import StatsCard from '../common/StatsCard';
import { PageLoader, StatsCardSkeleton } from '../common/LoadingAnimation';
import ErrorMessage from '../common/ErrorMessage';

/**
 * Dashboard component with real-time statistics
 */
const Dashboard = () => {
  const { patients, loading: patientsLoading } = usePatients({ skipQuery: false });
  const { doctors, activeDoctors, loading: doctorsLoading } = useDoctors({ skipQuery: false });
  const { 
    appointments, 
    todaysAppointments, 
    loading: appointmentsLoading,
    getAppointmentStats 
  } = useAppointments({ skipQuery: false });
  const { 
    queue, 
    queueStats, 
    loading: queueLoading 
  } = useQueue({ skipQuery: false });

  const [dashboardStats, setDashboardStats] = useState({
    totalPatients: 0,
    todaysAppointments: 0,
    completedAppointments: 0,
    pendingAppointments: 0,
    queueLength: 0,
    averageWaitTime: 0,
    activeDoctors: 0,
    totalDoctors: 0,
  });

  // Calculate dashboard statistics
  useEffect(() => {
    const appointmentStats = getAppointmentStats();
    const today = new Date().toISOString().split('T')[0];
    
    // Filter today's appointments
    const todayAppointments = appointments.filter(apt => apt.date === today);
    const completedToday = todayAppointments.filter(apt => apt.status === 'Completed').length;
    const pendingToday = todayAppointments.filter(apt => apt.status === 'Booked').length;

    // Calculate average wait time (simplified calculation)
    const waitingPatients = queue.filter(q => q.status === 'Waiting');
    const avgWaitTime = waitingPatients.length > 0 
      ? Math.round(waitingPatients.reduce((acc, q) => {
          const waitTime = q.createdAt ? 
            (new Date() - new Date(q.createdAt)) / (1000 * 60) : 0;
          return acc + waitTime;
        }, 0) / waitingPatients.length)
      : 0;

    setDashboardStats({
      totalPatients: patients.length,
      todaysAppointments: todayAppointments.length,
      completedAppointments: completedToday,
      pendingAppointments: pendingToday,
      queueLength: queueStats.waiting || 0,
      averageWaitTime: avgWaitTime,
      activeDoctors: activeDoctors.length,
      totalDoctors: doctors.length,
    });
  }, [patients, appointments, queue, queueStats, activeDoctors, doctors, getAppointmentStats]);

  const isLoading = patientsLoading || doctorsLoading || appointmentsLoading || queueLoading;

  if (isLoading) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome to the Clinic Front Desk System!
          </p>
        </div>
        
        {/* Loading skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, index) => (
            <StatsCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome to the Clinic Front Desk System!
        </p>
      </div>      {/* 
Real-time stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Patients"
          value={dashboardStats.totalPatients.toLocaleString()}
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              />
            </svg>
          }
          color="blue"
          trend={dashboardStats.totalPatients > 0 ? "up" : "neutral"}
          trendValue={dashboardStats.totalPatients > 0 ? "Active" : "No data"}
        />
        
        <StatsCard
          title="Today's Appointments"
          value={dashboardStats.todaysAppointments}
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          }
          color="green"
          subtitle={`${dashboardStats.completedAppointments} completed, ${dashboardStats.pendingAppointments} pending`}
        />
        
        <StatsCard
          title="Queue Length"
          value={dashboardStats.queueLength}
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m0 0h2m-2 0v4a2 2 0 002 2h2a2 2 0 002-2v-4m0 0h2a2 2 0 002-2V7a2 2 0 00-2-2h-2m-4 0V3a2 2 0 00-2-2H9a2 2 0 00-2 2v2m4 0h2"
              />
            </svg>
          }
          color="yellow"
          subtitle={`Average wait: ${dashboardStats.averageWaitTime} min`}
        />
        
        <StatsCard
          title="Active Doctors"
          value={dashboardStats.activeDoctors}
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          }
          color="purple"
          subtitle={`${dashboardStats.totalDoctors} total doctors`}
        />
      </div>
    </div>
  );
};

export default Dashboard;