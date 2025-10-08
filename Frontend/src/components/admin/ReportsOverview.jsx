import { useState, useEffect } from 'react';
import { formatDate, formatTime } from '../../utils/helpers';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import StatsCard from '../common/StatsCard';

/**
 * ReportsOverview component for admin analytics and reporting
 */
const ReportsOverview = () => {
  const [reportData, setReportData] = useState({
    summary: {
      totalPatients: 0,
      totalAppointments: 0,
      totalDoctors: 0,
      averageWaitTime: 0,
    },
    trends: {
      patientsGrowth: 0,
      appointmentsGrowth: 0,
      satisfactionScore: 0,
      efficiency: 0,
    },
    charts: {
      appointmentsByMonth: [],
      patientsByAge: [],
      doctorUtilization: [],
      queueMetrics: [],
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [selectedReport, setSelectedReport] = useState('overview');

  const reportTypes = [
    { key: 'overview', label: 'Overview', icon: '📊' },
    { key: 'appointments', label: 'Appointments', icon: '📅' },
    { key: 'patients', label: 'Patients', icon: '👥' },
    { key: 'doctors', label: 'Doctors', icon: '👨‍⚕️' },
    { key: 'queue', label: 'Queue Analytics', icon: '⏱️' },
    { key: 'financial', label: 'Financial', icon: '💰' },
  ];

  const periods = [
    { key: '7days', label: 'Last 7 Days' },
    { key: '30days', label: 'Last 30 Days' },
    { key: '90days', label: 'Last 3 Months' },
    { key: '1year', label: 'Last Year' },
  ];

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const mockData = {
          summary: {
            totalPatients: 1247,
            totalAppointments: 3456,
            totalDoctors: 12,
            averageWaitTime: 18,
          },
          trends: {
            patientsGrowth: 12.5,
            appointmentsGrowth: 8.3,
            satisfactionScore: 4.6,
            efficiency: 87.2,
          },
          charts: {
            appointmentsByMonth: [
              { month: 'Jan', appointments: 280, completed: 265, cancelled: 15 },
              { month: 'Feb', appointments: 320, completed: 305, cancelled: 15 },
              { month: 'Mar', appointments: 350, completed: 330, cancelled: 20 },
              { month: 'Apr', appointments: 380, completed: 360, cancelled: 20 },
              { month: 'May', appointments: 420, completed: 395, cancelled: 25 },
              { month: 'Jun', appointments: 450, completed: 425, cancelled: 25 },
            ],
            patientsByAge: [
              { ageGroup: '0-18', count: 156, percentage: 12.5 },
              { ageGroup: '19-35', count: 374, percentage: 30.0 },
              { ageGroup: '36-50', count: 436, percentage: 35.0 },
              { ageGroup: '51-65', count: 218, percentage: 17.5 },
              { ageGroup: '65+', count: 63, percentage: 5.0 },
            ],
            doctorUtilization: [
              { doctor: 'Dr. Sarah Johnson', utilization: 92, appointments: 45, specialty: 'Cardiology' },
              { doctor: 'Dr. Emily Davis', utilization: 88, appointments: 42, specialty: 'Pediatrics' },
              { doctor: 'Dr. Michael Brown', utilization: 85, appointments: 38, specialty: 'General Medicine' },
              { doctor: 'Dr. Lisa Wilson', utilization: 90, appointments: 44, specialty: 'Dermatology' },
            ],
            queueMetrics: [
              { date: '2024-01-01', avgWaitTime: 15, maxWaitTime: 45, totalPatients: 28 },
              { date: '2024-01-02', avgWaitTime: 18, maxWaitTime: 52, totalPatients: 32 },
              { date: '2024-01-03', avgWaitTime: 12, maxWaitTime: 38, totalPatients: 25 },
              { date: '2024-01-04', avgWaitTime: 22, maxWaitTime: 65, totalPatients: 35 },
              { date: '2024-01-05', avgWaitTime: 16, maxWaitTime: 42, totalPatients: 29 },
            ],
          },
        };

        setReportData(mockData);
      } catch (error) {
        setError('Failed to load report data');
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [selectedPeriod]);

  const handleExportReport = (format) => {
    // In real app, generate and download report
    console.log(`Exporting ${selectedReport} report as ${format}`);
    alert(`Exporting ${selectedReport} report as ${format.toUpperCase()}`);
  };

  const getSummaryStats = () => [
    {
      title: 'Total Patients',
      value: reportData.summary.totalPatients.toLocaleString(),
      subtitle: `+${reportData.trends.patientsGrowth}% vs last period`,
      trend: 'up',
      trendValue: `+${reportData.trends.patientsGrowth}%`,
      color: 'blue',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
    },
    {
      title: 'Total Appointments',
      value: reportData.summary.totalAppointments.toLocaleString(),
      subtitle: `+${reportData.trends.appointmentsGrowth}% vs last period`,
      trend: 'up',
      trendValue: `+${reportData.trends.appointmentsGrowth}%`,
      color: 'green',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'Average Wait Time',
      value: `${reportData.summary.averageWaitTime} min`,
      subtitle: 'Within target range',
      trend: 'neutral',
      trendValue: 'Target: <20 min',
      color: 'yellow',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'System Efficiency',
      value: `${reportData.trends.efficiency}%`,
      subtitle: 'Overall performance',
      trend: 'up',
      trendValue: 'Excellent',
      color: 'purple',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ];

  const renderOverviewReport = () => (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {getSummaryStats().map((stat, index) => (
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointments by Month */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Appointments by Month</h3>
          <div className="space-y-3">
            {reportData.charts.appointmentsByMonth.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{item.month}</span>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">{item.completed}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">{item.cancelled}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Patient Demographics */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Patient Demographics</h3>
          <div className="space-y-3">
            {reportData.charts.patientsByAge.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{item.ageGroup}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Doctor Utilization */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Doctor Utilization</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Specialty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Appointments
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilization
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reportData.charts.doctorUtilization.map((doctor, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {doctor.doctor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doctor.specialty}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doctor.appointments}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-3">
                        <div
                          className={`h-2 rounded-full ${
                            doctor.utilization >= 90 ? 'bg-green-600' :
                            doctor.utilization >= 80 ? 'bg-yellow-600' : 'bg-red-600'
                          }`}
                          style={{ width: `${doctor.utilization}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">{doctor.utilization}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderQuickReports = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Reports</h3>
        <div className="space-y-3">
          <button
            onClick={() => handleExportReport('pdf')}
            className="w-full btn-secondary text-left"
          >
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Daily Summary Report
          </button>
          <button
            onClick={() => handleExportReport('excel')}
            className="w-full btn-secondary text-left"
          >
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Patient Analytics
          </button>
          <button
            onClick={() => handleExportReport('csv')}
            className="w-full btn-secondary text-left"
          >
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Financial Report
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Scheduled Reports</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">Weekly Summary</p>
              <p className="text-xs text-gray-500">Every Monday at 9:00 AM</p>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Active
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">Monthly Analytics</p>
              <p className="text-xs text-gray-500">1st of each month</p>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Active
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Report Actions</h3>
        <div className="space-y-3">
          <button className="w-full btn-primary">
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Custom Report
          </button>
          <button className="w-full btn-secondary">
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Schedule Report
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Reports & Analytics</h2>
          <p className="mt-1 text-sm text-gray-500">
            Comprehensive reporting and data analytics
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="input-field"
          >
            {periods.map((period) => (
              <option key={period.key} value={period.key}>
                {period.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => handleExportReport('pdf')}
            className="btn-primary"
          >
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Report
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

      {/* Report Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {reportTypes.map((report) => (
            <button
              key={report.key}
              onClick={() => setSelectedReport(report.key)}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                selectedReport === report.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{report.icon}</span>
              {report.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Report Content */}
      {selectedReport === 'overview' && renderOverviewReport()}
      {selectedReport !== 'overview' && (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {reportTypes.find(r => r.key === selectedReport)?.label} Report
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            This report section is coming soon. Select Overview to see available analytics.
          </p>
        </div>
      )}

      {/* Quick Actions */}
      {selectedReport === 'overview' && renderQuickReports()}
    </div>
  );
};

export default ReportsOverview;