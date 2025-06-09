import React from 'react';
import Icon from 'components/AppIcon';

const PatientSelector = ({
  patients,
  selectedPatient,
  onPatientChange,
  dateRange,
  onDateRangeChange,
  comparisonMode,
  onComparisonModeChange
}) => {
  const dateRangeOptions = [
    { value: 'last-7-days', label: 'Last 7 Days' },
    { value: 'last-30-days', label: 'Last 30 Days' },
    { value: 'last-90-days', label: 'Last 90 Days' },
    { value: 'therapy-cycle-1', label: 'Therapy Cycle 1' },
    { value: 'therapy-cycle-2', label: 'Therapy Cycle 2' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const currentPatient = patients.find(p => p.id === selectedPatient);

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Patient Selector */}
        <div className="flex-1">
          <label className="block text-sm font-body-medium text-text-secondary mb-2">
            Selected Patient
          </label>
          <div className="relative">
            <select
              value={selectedPatient}
              onChange={(e) => onPatientChange(e.target.value)}
              className="w-full bg-surface-700 border border-border rounded-lg px-4 py-3 text-text-primary font-body-normal focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none pr-10"
            >
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name} - {patient.condition}
                </option>
              ))}
            </select>
            <Icon 
              name="ChevronDown" 
              size={16} 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary pointer-events-none" 
              strokeWidth={2}
            />
          </div>
          
          {currentPatient && (
            <div className="mt-2 flex items-center space-x-4 text-sm text-text-secondary">
              <span className="flex items-center space-x-1">
                <Icon name="User" size={14} strokeWidth={2} />
                <span>Age: {currentPatient.age}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Icon name="Calendar" size={14} strokeWidth={2} />
                <span>{currentPatient.sessions} sessions</span>
              </span>
              <span className="flex items-center space-x-1">
                <Icon name="Clock" size={14} strokeWidth={2} />
                <span>Last: {currentPatient.lastSession}</span>
              </span>
            </div>
          )}
        </div>

        {/* Date Range Selector */}
        <div className="flex-1">
          <label className="block text-sm font-body-medium text-text-secondary mb-2">
            Date Range
          </label>
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => onDateRangeChange(e.target.value)}
              className="w-full bg-surface-700 border border-border rounded-lg px-4 py-3 text-text-primary font-body-normal focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none pr-10"
            >
              {dateRangeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Icon 
              name="ChevronDown" 
              size={16} 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary pointer-events-none" 
              strokeWidth={2}
            />
          </div>
        </div>

        {/* Comparison Mode Toggle */}
        <div className="flex-shrink-0">
          <label className="block text-sm font-body-medium text-text-secondary mb-2">
            Analysis Mode
          </label>
          <button
            onClick={() => onComparisonModeChange(!comparisonMode)}
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg clinical-transition font-body-medium ${
              comparisonMode
                ? 'bg-primary text-background' :'bg-surface-700 border border-border text-text-primary hover:bg-surface-600'
            }`}
          >
            <Icon 
              name={comparisonMode ? "GitCompare" : "BarChart3"} 
              size={16} 
              strokeWidth={2}
            />
            <span>{comparisonMode ? 'Comparison' : 'Standard'}</span>
          </button>
        </div>

        {/* Condition Filter */}
        <div className="flex-shrink-0">
          <label className="block text-sm font-body-medium text-text-secondary mb-2">
            Condition Filter
          </label>
          <div className="flex items-center space-x-2">
            <div className={`px-3 py-2 rounded-lg text-xs font-body-medium ${
              currentPatient?.condition === 'Essential Tremor' ?'bg-warning/20 text-warning border border-warning/30'
                : currentPatient?.condition === 'Parkinson\'s Disease' ?'bg-error/20 text-error border border-error/30' :'bg-accent/20 text-accent border border-accent/30'
            }`}>
              {currentPatient?.condition}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientSelector;