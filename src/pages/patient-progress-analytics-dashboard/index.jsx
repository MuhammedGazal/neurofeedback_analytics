import React, { useState, useMemo } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import Icon from 'components/AppIcon';
import Breadcrumb from 'components/ui/Breadcrumb';
import PatientSelector from './components/PatientSelector';
import KPIMetrics from './components/KPIMetrics';
import SessionStatistics from './components/SessionStatistics';
import ComparisonCharts from './components/ComparisonCharts';
import FilterPanel from './components/FilterPanel';

const PatientProgressAnalyticsDashboard = () => {
  const [selectedPatient, setSelectedPatient] = useState('patient-001');
  const [dateRange, setDateRange] = useState('last-30-days');
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    muscleGroups: ['all'],
    therapyProtocols: ['all'],
    treatmentPhases: ['all']
  });
  const [activeChart, setActiveChart] = useState('performance');
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Mock patient data
  const patients = [
    {
      id: 'patient-001',
      name: 'Sarah Johnson',
      condition: 'Essential Tremor',
      age: 67,
      sessions: 24,
      lastSession: '2024-01-15'
    },
    {
      id: 'patient-002',
      name: 'Michael Chen',
      condition: 'Parkinson\'s Disease',
      age: 72,
      sessions: 18,
      lastSession: '2024-01-14'
    },
    {
      id: 'patient-003',
      name: 'Emma Rodriguez',
      condition: 'Muscle Fatigue Syndrome',
      age: 45,
      sessions: 32,
      lastSession: '2024-01-15'
    }
  ];

  // Mock session performance data
  const sessionPerformanceData = [
    {
      date: '2024-01-01',
      session: 1,
      treatmentEffectiveness: 65,
      tremorReduction: 45,
      muscleFatigue: 78,
      engagement: 82,
      rmsAverage: 0.45,
      fftPower: 0.32,
      thresholdAchievements: 12
    },
    {
      date: '2024-01-03',
      session: 2,
      treatmentEffectiveness: 72,
      tremorReduction: 52,
      muscleFatigue: 74,
      engagement: 85,
      rmsAverage: 0.42,
      fftPower: 0.29,
      thresholdAchievements: 15
    },
    {
      date: '2024-01-05',
      session: 3,
      treatmentEffectiveness: 78,
      tremorReduction: 58,
      muscleFatigue: 71,
      engagement: 88,
      rmsAverage: 0.38,
      fftPower: 0.26,
      thresholdAchievements: 18
    },
    {
      date: '2024-01-08',
      session: 4,
      treatmentEffectiveness: 81,
      tremorReduction: 63,
      muscleFatigue: 68,
      engagement: 91,
      rmsAverage: 0.35,
      fftPower: 0.23,
      thresholdAchievements: 21
    },
    {
      date: '2024-01-10',
      session: 5,
      treatmentEffectiveness: 85,
      tremorReduction: 67,
      muscleFatigue: 65,
      engagement: 93,
      rmsAverage: 0.32,
      fftPower: 0.21,
      thresholdAchievements: 24
    },
    {
      date: '2024-01-12',
      session: 6,
      treatmentEffectiveness: 88,
      tremorReduction: 71,
      muscleFatigue: 62,
      engagement: 95,
      rmsAverage: 0.29,
      fftPower: 0.19,
      thresholdAchievements: 27
    },
    {
      date: '2024-01-15',
      session: 7,
      treatmentEffectiveness: 91,
      tremorReduction: 74,
      muscleFatigue: 59,
      engagement: 97,
      rmsAverage: 0.27,
      fftPower: 0.17,
      thresholdAchievements: 30
    }
  ];

  // Mock before/after comparison data
  const beforeAfterData = [
    {
      frequency: '4Hz',
      before: 0.85,
      after: 0.32,
      improvement: 62
    },
    {
      frequency: '5Hz',
      before: 0.92,
      after: 0.28,
      improvement: 70
    },
    {
      frequency: '6Hz',
      before: 0.78,
      after: 0.25,
      improvement: 68
    },
    {
      frequency: '7Hz',
      before: 0.65,
      after: 0.22,
      improvement: 66
    }
  ];

  const currentPatient = patients.find(p => p.id === selectedPatient);

  const handleRefresh = () => {
    setLastRefresh(new Date());
  };

  const handleExport = (format) => {
    console.log(`Exporting data in ${format} format`);
  };

  const chartOptions = [
    { id: 'performance', label: 'Session Performance', icon: 'TrendingUp' },
    { id: 'rms', label: 'RMS Trends', icon: 'Activity' },
    { id: 'fft', label: 'FFT Patterns', icon: 'BarChart3' },
    { id: 'thresholds', label: 'Threshold Achievements', icon: 'Target' }
  ];

  const getChartData = () => {
    switch (activeChart) {
      case 'rms':
        return sessionPerformanceData.map(d => ({
          ...d,
          value: d.rmsAverage,
          label: 'RMS Average'
        }));
      case 'fft':
        return sessionPerformanceData.map(d => ({
          ...d,
          value: d.fftPower,
          label: 'FFT Power'
        }));
      case 'thresholds':
        return sessionPerformanceData.map(d => ({
          ...d,
          value: d.thresholdAchievements,
          label: 'Achievements'
        }));
      default:
        return sessionPerformanceData;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <Breadcrumb />
              <h1 className="text-3xl font-heading-bold text-text-primary mt-2 mb-2">
                Patient Progress Analytics
              </h1>
              <p className="text-text-secondary font-body-normal">
                Longitudinal tracking and treatment efficacy analysis for neurofeedback therapy sessions
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-text-secondary">
                <Icon name="Clock" size={16} strokeWidth={2} />
                <span>Last updated: {lastRefresh.toLocaleTimeString()}</span>
              </div>
              
              <button
                onClick={handleRefresh}
                className="flex items-center space-x-2 px-4 py-2 bg-surface border border-border rounded-lg clinical-transition hover:bg-surface-700 text-text-primary"
              >
                <Icon name="RefreshCw" size={16} strokeWidth={2} />
                <span className="font-body-medium">Refresh</span>
              </button>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleExport('pdf')}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-background rounded-lg clinical-transition hover:bg-primary-600 font-body-medium"
                >
                  <Icon name="FileText" size={16} strokeWidth={2} />
                  <span>Export PDF</span>
                </button>
                
                <button
                  onClick={() => handleExport('csv')}
                  className="flex items-center space-x-2 px-4 py-2 bg-surface border border-border rounded-lg clinical-transition hover:bg-surface-700 text-text-primary font-body-medium"
                >
                  <Icon name="Download" size={16} strokeWidth={2} />
                  <span>CSV</span>
                </button>
              </div>
            </div>
          </div>

          {/* Controls Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
            <div className="lg:col-span-8">
              <PatientSelector
                patients={patients}
                selectedPatient={selectedPatient}
                onPatientChange={setSelectedPatient}
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                comparisonMode={comparisonMode}
                onComparisonModeChange={setComparisonMode}
              />
            </div>
            
            <div className="lg:col-span-4">
              <FilterPanel
                selectedFilters={selectedFilters}
                onFiltersChange={setSelectedFilters}
              />
            </div>
          </div>
        </div>

        {/* KPI Metrics */}
        <div className="mb-8">
          <KPIMetrics 
            sessionData={sessionPerformanceData}
            patient={currentPatient}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Main Visualization Area */}
          <div className="lg:col-span-8">
            <div className="bg-surface border border-border rounded-lg p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <h3 className="text-lg font-heading-semibold text-text-primary mb-4 sm:mb-0">
                  Session Performance Analysis
                </h3>
                
                <div className="flex items-center space-x-2">
                  {chartOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setActiveChart(option.id)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg clinical-transition text-sm font-body-medium ${
                        activeChart === option.id
                          ? 'bg-primary text-background' :'bg-surface-700 text-text-secondary hover:text-text-primary hover:bg-surface-600'
                      }`}
                    >
                      <Icon name={option.icon} size={14} strokeWidth={2} />
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  {activeChart === 'performance' ? (
                    <ComposedChart data={getChartData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                      <XAxis 
                        dataKey="session" 
                        stroke="#94A3B8"
                        fontSize={12}
                        tickFormatter={(value) => `S${value}`}
                      />
                      <YAxis stroke="#94A3B8" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1E293B',
                          border: '1px solid rgba(148, 163, 184, 0.2)',
                          borderRadius: '8px',
                          color: '#F8FAFC'
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="treatmentEffectiveness"
                        stroke="#00D4FF"
                        strokeWidth={2}
                        dot={{ fill: '#00D4FF', strokeWidth: 2, r: 4 }}
                        name="Treatment Effectiveness (%)"
                      />
                      <Line
                        type="monotone"
                        dataKey="tremorReduction"
                        stroke="#10B981"
                        strokeWidth={2}
                        dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                        name="Tremor Reduction (%)"
                      />
                      <Line
                        type="monotone"
                        dataKey="engagement"
                        stroke="#7C3AED"
                        strokeWidth={2}
                        dot={{ fill: '#7C3AED', strokeWidth: 2, r: 4 }}
                        name="Engagement Score (%)"
                      />
                    </ComposedChart>
                  ) : (
                    <LineChart data={getChartData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                      <XAxis 
                        dataKey="session" 
                        stroke="#94A3B8"
                        fontSize={12}
                        tickFormatter={(value) => `S${value}`}
                      />
                      <YAxis stroke="#94A3B8" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1E293B',
                          border: '1px solid rgba(148, 163, 184, 0.2)',
                          borderRadius: '8px',
                          color: '#F8FAFC'
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#00D4FF"
                        strokeWidth={3}
                        dot={{ fill: '#00D4FF', strokeWidth: 2, r: 5 }}
                        name={getChartData()[0]?.label || 'Value'}
                      />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="lg:col-span-4">
            <SessionStatistics 
              sessionData={sessionPerformanceData}
              patient={currentPatient}
            />
          </div>
        </div>

        {/* Before/After Comparison Charts */}
        <div className="mb-8">
          <ComparisonCharts 
            beforeAfterData={beforeAfterData}
            sessionData={sessionPerformanceData}
          />
        </div>

        {/* Additional Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Muscle Fatigue Trends */}
          <div className="bg-surface border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-heading-semibold text-text-primary">
                Muscle Fatigue Trends
              </h3>
              <Icon name="Activity" size={20} className="text-accent" strokeWidth={2} />
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sessionPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                  <XAxis 
                    dataKey="session" 
                    stroke="#94A3B8"
                    fontSize={12}
                    tickFormatter={(value) => `S${value}`}
                  />
                  <YAxis stroke="#94A3B8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      border: '1px solid rgba(148, 163, 184, 0.2)',
                      borderRadius: '8px',
                      color: '#F8FAFC'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="muscleFatigue"
                    stroke="#10B981"
                    fill="rgba(16, 185, 129, 0.1)"
                    strokeWidth={2}
                    name="Muscle Fatigue Improvement (%)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Threshold Achievements */}
          <div className="bg-surface border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-heading-semibold text-text-primary">
                Threshold Achievements
              </h3>
              <Icon name="Target" size={20} className="text-warning" strokeWidth={2} />
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sessionPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                  <XAxis 
                    dataKey="session" 
                    stroke="#94A3B8"
                    fontSize={12}
                    tickFormatter={(value) => `S${value}`}
                  />
                  <YAxis stroke="#94A3B8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      border: '1px solid rgba(148, 163, 184, 0.2)',
                      borderRadius: '8px',
                      color: '#F8FAFC'
                    }}
                  />
                  <Bar
                    dataKey="thresholdAchievements"
                    fill="#F59E0B"
                    radius={[4, 4, 0, 0]}
                    name="Threshold Achievements"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProgressAnalyticsDashboard;