import { useState } from 'react';
import { useDashboard } from '../../hooks/useDashboard';

/**
 * DashboardCharts component for data visualization
 * Note: This is a placeholder implementation. In a real application,
 * you would integrate with a charting library like Chart.js, Recharts, or D3.js
 */
const DashboardCharts = () => {
  const { stats, weeklySummary, loading } = useDashboard();
  const [activeChart, setActiveChart] = useState('appointments');

  // Mock chart data - in a real app, this would come from the API
  const chartData = {
    appointments: {
      title: 'Appointments This Week',
      data: [
        { day: 'Mon', value: 12 },
        { day: 'Tue', value: 15 },
        { day: 'Wed', value: 8 },
        { day: 'Thu', value: 18 },
        { day: 'Fri', value: 14 },
        { day: 'Sat', value: 6 },
        { day: 'Sun', value: 3 },
      ],
    },
    patients: {
      title: 'New Patients This Month',
      data: [
        { week: 'Week 1', value: 8 },
        { week: 'Week 2', value: 12 },
        { week: 'Week 3', value: 6 },
        { week: 'Week 4', value: 10 },
      ],
    },
    queue: {
      title: 'Queue Performance',
      data: [
        { hour: '9 AM', waiting: 5, completed: 0 },
        { hour: '10 AM', waiting: 8, completed: 3 },
        { hour: '11 AM', waiting: 6, completed: 7 },
        { hour: '12 PM', waiting: 4, completed: 10 },
        { hour: '1 PM', waiting: 3, completed: 8 },
        { hour: '2 PM', waiting: 7, completed: 12 },
        { hour: '3 PM', waiting: 5, completed: 15 },
        { hour: '4 PM', waiting: 2, completed: 18 },
      ],
    },
  };

  const chartTabs = [
    { key: 'appointments', label: 'Appointments', icon: '📅' },
    { key: 'patients', label: 'Patients', icon: '👥' },
    { key: 'queue', label: 'Queue', icon: '⏱️' },
  ];

  // Simple bar chart component (placeholder)
  const SimpleBarChart = ({ data, title }) => {
    const maxValue = Math.max(...data.map(item => item.value || Math.max(item.waiting || 0, item.completed || 0)));
    
    return (
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-900">{title}</h4>
        <div className="space-y-3">
          {data.map((item, index) => {
            const label = item.day || item.week || item.hour;
            const value = item.value;
            const waiting = item.waiting;
            const completed = item.completed;
            
            return (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-12 text-xs text-gray-500 text-right">
                  {label}
                </div>
                <div className="flex-1 flex items-center space-x-1">
                  {value !== undefined ? (
                    // Single value bar
                    <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                      <div
                        className="bg-blue-500 h-4 rounded-full transition-all duration-300"
                        style={{ width: `${(value / maxValue) * 100}%` }}
                      />
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                        {value}
                      </span>
                    </div>
                  ) : (
                    // Stacked bars for queue data
                    <div className="flex-1 flex space-x-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                        <div
                          className="bg-yellow-500 h-4 rounded-full transition-all duration-300"
                          style={{ width: `${(waiting / maxValue) * 100}%` }}
                        />
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                          {waiting}
                        </span>
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                        <div
                          className="bg-green-500 h-4 rounded-full transition-all duration-300"
                          style={{ width: `${(completed / maxValue) * 100}%` }}
                        />
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                          {completed}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Legend for queue chart */}
        {activeChart === 'queue' && (
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Waiting</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Completed</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Statistics summary component
  const StatsSummary = () => (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="text-2xl font-bold text-blue-600">
          {stats.appointments?.today || 0}
        </div>
        <div className="text-sm text-blue-800">Today's Appointments</div>
      </div>
      <div className="bg-green-50 rounded-lg p-4">
        <div className="text-2xl font-bold text-green-600">
          {stats.appointments?.completed || 0}
        </div>
        <div className="text-sm text-green-800">Completed</div>
      </div>
      <div className="bg-yellow-50 rounded-lg p-4">
        <div className="text-2xl font-bold text-yellow-600">
          {stats.queue?.waiting || 0}
        </div>
        <div className="text-sm text-yellow-800">In Queue</div>
      </div>
      <div className="bg-purple-50 rounded-lg p-4">
        <div className="text-2xl font-bold text-purple-600">
          {stats.patients?.newToday || 0}
        </div>
        <div className="text-sm text-purple-800">New Patients</div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="h-3 bg-gray-200 rounded w-12"></div>
                <div className="flex-1 h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Analytics Overview</h3>
            <p className="mt-1 text-sm text-gray-500">
              Visual insights into clinic performance
            </p>
          </div>
          
          {/* Chart type selector */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {chartTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveChart(tab.key)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  activeChart === tab.key
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="mr-1">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <StatsSummary />
        
        <SimpleBarChart
          data={chartData[activeChart].data}
          title={chartData[activeChart].title}
        />
        
        {/* Chart insights */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Insights</h4>
          <div className="text-sm text-gray-600 space-y-1">
            {activeChart === 'appointments' && (
              <>
                <p>• Peak appointment day: Thursday with 18 appointments</p>
                <p>• Weekend appointments are significantly lower</p>
                <p>• Average daily appointments: 11</p>
              </>
            )}
            {activeChart === 'patients' && (
              <>
                <p>• Steady patient growth with 36 new patients this month</p>
                <p>• Week 2 had the highest registration rate</p>
                <p>• Average weekly growth: 9 new patients</p>
              </>
            )}
            {activeChart === 'queue' && (
              <>
                <p>• Peak queue time: 2 PM with 7 waiting patients</p>
                <p>• Most efficient period: 4 PM with 18 completed visits</p>
                <p>• Average wait time decreases throughout the day</p>
              </>
            )}
          </div>
        </div>
        
        {/* Note about chart library */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex">
            <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="ml-3">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> This is a simplified chart implementation. 
                In production, integrate with Chart.js, Recharts, or similar library for advanced visualizations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;