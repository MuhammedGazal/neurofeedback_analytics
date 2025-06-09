// /home/ubuntu/app/neurofeedback_analytics/src/pages/real-time-signal-monitoring-dashboard/components/BluetoothDeviceSelector.jsx

import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import { bluetoothService } from 'utils';

const BluetoothDeviceSelector = ({ onConnectionStatusChange }) => {
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [deviceName, setDeviceName] = useState(null);

  const handleConnect = async () => {
    setConnecting(true);
    setError(null);
    
    try {
      if (!bluetoothService.isBluetoothSupported()) {
        throw new Error('Web Bluetooth API is not supported in this browser');
      }
      
      onConnectionStatusChange('connecting');
      const result = await bluetoothService.connect();
      
      setDeviceName(result.deviceName);
      onConnectionStatusChange('connected');
    } catch (err) {
      console.error('Connection error:', err);
      setError(err.message || 'Failed to connect to Myo device');
      onConnectionStatusChange('disconnected');
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = () => {
    bluetoothService.disconnect();
    setDeviceName(null);
    onConnectionStatusChange('disconnected');
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      <h3 className="text-sm font-body-medium text-text-primary mb-3">Bluetooth Device</h3>
      
      {deviceName ? (
        <div className="flex flex-col space-y-3">
          <div className="flex items-center space-x-2">
            <Icon name="Bluetooth" size={16} className="text-primary" strokeWidth={2} />
            <span className="text-sm font-body-medium text-text-primary">{deviceName}</span>
          </div>
          
          <button
            onClick={handleDisconnect}
            className="flex items-center justify-center space-x-2 px-3 py-2 bg-error/10 text-error text-sm font-body-medium rounded clinical-transition hover:bg-error/20"
          >
            <Icon name="BluetoothOff" size={14} strokeWidth={2} />
            <span>Disconnect</span>
          </button>
        </div>
      ) : (
        <div className="flex flex-col space-y-3">
          <button
            onClick={handleConnect}
            disabled={connecting}
            className="flex items-center justify-center space-x-2 px-3 py-2 bg-primary text-background text-sm font-body-medium rounded clinical-transition hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {connecting ? (
              <>
                <Icon name="Loader" size={14} className="animate-spin" strokeWidth={2} />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <Icon name="Bluetooth" size={14} strokeWidth={2} />
                <span>Connect Myo Device</span>
              </>
            )}
          </button>
          
          {error && (
            <p className="text-xs text-error">{error}</p>
          )}
          
          <p className="text-xs text-text-tertiary">
            Make sure your Myo Armband is powered on and in pairing mode.
          </p>
        </div>
      )}
    </div>
  );
};

export default BluetoothDeviceSelector;