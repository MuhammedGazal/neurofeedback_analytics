import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const IMUDataPanel = ({ imuData, isRecording }) => {
  const [activeView, setActiveView] = useState('accelerometer');
  const [showQuaternion, setShowQuaternion] = useState(false);

  const views = [
    { id: 'accelerometer', label: 'Accelerometer', icon: 'Move3D' },
    { id: 'gyroscope', label: 'Gyroscope', icon: 'RotateCcw' },
    { id: 'orientation', label: '3D Orientation', icon: 'Compass' }
  ];

  const formatValue = (value) => {
    return value ? value.toFixed(3) : '0.000';
  };

  const getAccelerometerMagnitude = () => {
    if (!imuData.accelerometer) return 0;
    const { x, y, z } = imuData.accelerometer;
    return Math.sqrt(x * x + y * y + z * z);
  };

  const getGyroscopeMagnitude = () => {
    if (!imuData.gyroscope) return 0;
    const { x, y, z } = imuData.gyroscope;
    return Math.sqrt(x * x + y * y + z * z);
  };

  const renderAccelerometerView = () => (
    <div className="space-y-4">
      {/* Magnitude Display */}
      <div className="bg-background border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-body-medium text-text-primary">Total Acceleration</span>
          <span className="text-lg font-data-bold text-primary">
            {formatValue(getAccelerometerMagnitude())} g
          </span>
        </div>
        <div className="w-full bg-surface-700 rounded-full h-2">
          <div 
            className="h-2 bg-primary rounded-full clinical-transition"
            style={{ width: `${Math.min((getAccelerometerMagnitude() / 5) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Individual Axes */}
      <div className="grid grid-cols-3 gap-3">
        {['x', 'y', 'z'].map((axis, index) => (
          <div key={axis} className="bg-background border border-border rounded-lg p-3">
            <div className="text-center">
              <div className={`text-xs font-body-medium mb-1 ${
                index === 0 ? 'text-error' : index === 1 ? 'text-success' : 'text-primary'
              }`}>
                {axis.toUpperCase()}-Axis
              </div>
              <div className={`text-lg font-data-bold ${
                index === 0 ? 'text-error' : index === 1 ? 'text-success' : 'text-primary'
              }`}>
                {formatValue(imuData.accelerometer?.[axis])}
              </div>
              <div className="text-xs text-text-secondary">g</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGyroscopeView = () => (
    <div className="space-y-4">
      {/* Angular Velocity Display */}
      <div className="bg-background border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-body-medium text-text-primary">Angular Velocity</span>
          <span className="text-lg font-data-bold text-secondary">
            {formatValue(getGyroscopeMagnitude())} °/s
          </span>
        </div>
        <div className="w-full bg-surface-700 rounded-full h-2">
          <div 
            className="h-2 bg-secondary rounded-full clinical-transition"
            style={{ width: `${Math.min((getGyroscopeMagnitude() / 200) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Individual Axes */}
      <div className="grid grid-cols-3 gap-3">
        {['x', 'y', 'z'].map((axis, index) => (
          <div key={axis} className="bg-background border border-border rounded-lg p-3">
            <div className="text-center">
              <div className={`text-xs font-body-medium mb-1 ${
                index === 0 ? 'text-error' : index === 1 ? 'text-success' : 'text-primary'
              }`}>
                {axis.toUpperCase()}-Rotation
              </div>
              <div className={`text-lg font-data-bold ${
                index === 0 ? 'text-error' : index === 1 ? 'text-success' : 'text-primary'
              }`}>
                {formatValue(imuData.gyroscope?.[axis])}
              </div>
              <div className="text-xs text-text-secondary">°/s</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const render3DOrientationView = () => (
    <div className="space-y-4">
      {/* 3D Visualization Placeholder */}
      <div className="bg-background border border-border rounded-lg p-6">
        <div className="aspect-square flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-surface border-2 border-primary rounded-lg mx-auto mb-4 flex items-center justify-center">
              <Icon name="Compass" size={32} className="text-primary" strokeWidth={1.5} />
            </div>
            <p className="text-sm text-text-secondary">
              3D Orientation Visualization
            </p>
            <p className="text-xs text-text-tertiary mt-1">
              Real-time device orientation display
            </p>
          </div>
        </div>
      </div>

      {/* Quaternion Toggle */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-body-medium text-text-primary">Show Quaternion Data</span>
        <button
          onClick={() => setShowQuaternion(!showQuaternion)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full clinical-transition ${
            showQuaternion ? 'bg-primary' : 'bg-surface-700'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white clinical-transition ${
              showQuaternion ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Quaternion Data */}
      {showQuaternion && (
        <div className="grid grid-cols-2 gap-3">
          {['w', 'x', 'y', 'z'].map((component) => (
            <div key={component} className="bg-background border border-border rounded-lg p-3">
              <div className="text-center">
                <div className="text-xs font-body-medium text-text-secondary mb-1">
                  Q{component.toUpperCase()}
                </div>
                <div className="text-sm font-data-bold text-text-primary">
                  {formatValue(imuData.quaternion?.[component])}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderActiveView = () => {
    switch (activeView) {
      case 'accelerometer':
        return renderAccelerometerView();
      case 'gyroscope':
        return renderGyroscopeView();
      case 'orientation':
        return render3DOrientationView();
      default:
        return renderAccelerometerView();
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-lg font-heading-semibold text-text-primary mb-1">
            IMU Data Monitoring
          </h2>
          <p className="text-sm text-text-secondary">
            Inertial measurement unit sensor readings
          </p>
        </div>

        {/* Recording Indicator */}
        {isRecording && (
          <div className="flex items-center space-x-2 px-3 py-2 bg-success/10 border border-success/30 rounded-lg">
            <div className="w-2 h-2 bg-success rounded-full pulse-alert" />
            <span className="text-xs font-body-medium text-success">Recording</span>
          </div>
        )}
      </div>

      {/* View Selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {views.map((view) => (
          <button
            key={view.id}
            onClick={() => setActiveView(view.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg clinical-transition ${
              activeView === view.id
                ? 'bg-primary text-background' :'bg-background border border-border text-text-secondary hover:text-text-primary hover:border-primary/50'
            }`}
          >
            <Icon name={view.icon} size={16} strokeWidth={2} />
            <span className="text-sm font-body-medium">{view.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {imuData && Object.keys(imuData).length > 0 ? (
        renderActiveView()
      ) : (
        <div className="text-center py-12">
          <Icon name="Compass" size={48} className="text-text-tertiary mx-auto mb-4" strokeWidth={1} />
          <p className="text-text-secondary font-body-normal">
            {isRecording ? 'Waiting for IMU data...' : 'Start a session to monitor IMU data'}
          </p>
        </div>
      )}
    </div>
  );
};

export default IMUDataPanel;