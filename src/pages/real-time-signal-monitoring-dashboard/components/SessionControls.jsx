// /home/ubuntu/app/neurofeedback_analytics/src/pages/real-time-signal-monitoring-dashboard/components/SessionControls.jsx
import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import BluetoothDeviceSelector from './BluetoothDeviceSelector';

const SessionControls = ({
  patients,
  selectedPatient,
  onPatientSelect,
  isRecording,
  sessionTimer,
  connectionStatus,
  onConnectionStatusChange,
  hapticFeedback,
  onHapticToggle,
  onStartSession,
  onStopSession,
  onEmergencyStop
}) => {
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-success';
      case 'connecting': return 'text-warning';
      case 'disconnected': return 'text-error';
      default: return 'text-text-tertiary';
    }
  };

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return 'Wifi';
      case 'connecting': return 'Loader';
      case 'disconnected': return 'WifiOff';
      default: return 'Wifi';
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Patient Selector */}
        <div className="lg:col-span-3">
          <label className="block text-sm font-body-medium text-text-primary mb-2">
            Active Patient
          </label>
          <div className="relative">
            <button
              onClick={() => setShowPatientDropdown(!showPatientDropdown)}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-left clinical-transition hover:border-primary/50 focus:border-primary focus:outline-none"
              disabled={isRecording}
            >
              <div className="flex items-center justify-between">
                <div>
                  {selectedPatient ? (
                    <div>
                      <p className="text-sm font-body-medium text-text-primary">
                        {selectedPatient.name}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {selectedPatient.condition}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-text-secondary">Select patient...</p>
                  )}
                </div>
                <Icon 
                  name={showPatientDropdown ? "ChevronUp" : "ChevronDown"} 
                  size={16} 
                  className="text-text-tertiary"
                  strokeWidth={2}
                />
              </div>
            </button>

            {showPatientDropdown && !isRecording && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-lg shadow-lg z-50">
                {patients.map((patient) => (
                  <button
                    key={patient.id}
                    onClick={() => {
                      onPatientSelect(patient);
                      setShowPatientDropdown(false);
                    }}
                    className="w-full px-4 py-3 text-left clinical-transition hover:bg-surface-700 first:rounded-t-lg last:rounded-b-lg"
                  >
                    <div>
                      <p className="text-sm font-body-medium text-text-primary">
                        {patient.name}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {patient.condition} • {patient.sessionCount} sessions
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Session Timer */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-body-medium text-text-primary mb-2">
            Session Time
          </label>
          <div className="flex items-center space-x-2">
            <div className="px-4 py-3 bg-background border border-border rounded-lg">
              <p className="text-lg font-data-bold text-primary">
                {sessionTimer}
              </p>
            </div>
            {isRecording && (
              <div className="w-3 h-3 bg-error rounded-full pulse-alert" />
            )}
          </div>
        </div>

        {/* Connection Status */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-body-medium text-text-primary mb-2">
            Connection
          </label>
          <div className="flex items-center space-x-2 px-4 py-3 bg-background border border-border rounded-lg">
            <Icon 
              name={getConnectionStatusIcon()} 
              size={16} 
              className={`${getConnectionStatusColor()} ${connectionStatus === 'connecting' ? 'animate-spin' : ''}`}
              strokeWidth={2}
            />
            <span className={`text-sm font-body-medium ${getConnectionStatusColor()}`}>
              {connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}
            </span>
          </div>
        </div>

        {/* Bluetooth Device Selector */}
        <div className="lg:col-span-2">
          <BluetoothDeviceSelector 
            onConnectionStatusChange={onConnectionStatusChange} 
          />
        </div>

        {/* Haptic Feedback Toggle */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-body-medium text-text-primary mb-2">
            Haptic Feedback
          </label>
          <button
            onClick={() => onHapticToggle(!hapticFeedback)}
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg border clinical-transition ${
              hapticFeedback 
                ? 'bg-primary/10 border-primary/30 text-primary' :'bg-background border-border text-text-secondary hover:text-text-primary'
            }`}
            disabled={isRecording || connectionStatus !== 'connected'}
          >
            <Icon 
              name={hapticFeedback ? "Vibrate" : "VibrateOff"} 
              size={16} 
              strokeWidth={2}
            />
            <span className="text-sm font-body-medium">
              {hapticFeedback ? 'Enabled' : 'Disabled'}
            </span>
          </button>
        </div>

        {/* Session Controls */}
        <div className="lg:col-span-1 flex items-end space-x-3">
          {!isRecording ? (
            <button
              onClick={onStartSession}
              disabled={!selectedPatient || connectionStatus !== 'connected'}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-success text-background font-body-medium rounded-lg clinical-transition hover:bg-success-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon name="Play" size={16} strokeWidth={2} />
              <span>Start</span>
            </button>
          ) : (
            <button
              onClick={onStopSession}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-warning text-background font-body-medium rounded-lg clinical-transition hover:bg-warning-600"
            >
              <Icon name="Pause" size={16} strokeWidth={2} />
              <span>Stop</span>
            </button>
          )}
        </div>
        
        {/* Emergency Stop */}
        <div className="lg:col-span-0 flex items-end">
          <button
            onClick={onEmergencyStop}
            className="flex items-center justify-center w-12 h-12 bg-error text-background rounded-lg clinical-transition hover:bg-error-600"
            title="Emergency Stop"
          >
            <Icon name="Square" size={20} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionControls;