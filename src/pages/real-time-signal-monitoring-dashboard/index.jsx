// /home/ubuntu/app/neurofeedback_analytics/src/pages/real-time-signal-monitoring-dashboard/index.jsx
import React, { useState, useEffect, useRef } from 'react';

import Breadcrumb from 'components/ui/Breadcrumb';
import SessionControls from './components/SessionControls';
import EMGSignalChart from './components/EMGSignalChart';
import RealTimeMetrics from './components/RealTimeMetrics';
import IMUDataPanel from './components/IMUDataPanel';
import FFTSpectrumAnalysis from './components/FFTSpectrumAnalysis';
import { bluetoothService } from 'utils';

const RealTimeSignalMonitoringDashboard = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [sessionTimer, setSessionTimer] = useState(0);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [signalData, setSignalData] = useState([]);
  const [imuData, setIMUData] = useState({});
  const [fftData, setFFTData] = useState([]);
  const [channelSettings, setChannelSettings] = useState({});
  const [viewMode, setViewMode] = useState('filtered');
  const [timeWindow, setTimeWindow] = useState(10);
  const intervalRef = useRef(null);

  // Mock patients data
  const patients = [
    {
      id: 1,
      name: "Sarah Johnson",
      age: 34,
      condition: "Essential Tremor",
      sessionCount: 12,
      lastSession: "2024-01-15"
    },
    {
      id: 2,
      name: "Michael Chen",
      age: 67,
      condition: "Parkinson\'s Disease",
      sessionCount: 8,
      lastSession: "2024-01-14"
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      age: 29,
      condition: "Muscle Fatigue",
      sessionCount: 15,
      lastSession: "2024-01-13"
    }
  ];

  // Set up bluetooth event listeners
  useEffect(() => {
    // Event listener for EMG data
    const handleEMGData = (data) => {
      if (!isRecording) return;
      
      setSignalData(prev => {
        const newData = [...prev, data];
        return newData.slice(-timeWindow * 10); // Keep last N seconds
      });
    };
    
    // Event listener for IMU data
    const handleIMUData = (data) => {
      if (!isRecording) return;
      setIMUData(data);
      
      // Generate FFT data based on IMU and EMG data
      // This is a simplified example - real FFT would use a DSP library
      const fftChannels = Array.from({ length: 8 }, (_, i) => ({
        channel: i + 1,
        frequencies: Array.from({ length: 50 }, (_, f) => ({
          frequency: f * 2,
          magnitude: Math.random() * 100 * Math.exp(-f / 10) // Mock data
        }))
      }));
      setFFTData(fftChannels);
    };
    
    // Event listener for connection status changes
    const handleConnectionChange = (data) => {
      setConnectionStatus(data.status);
    };
    
    // Add event listeners
    bluetoothService.addEventListener('emg', handleEMGData);
    bluetoothService.addEventListener('imu', handleIMUData);
    bluetoothService.addEventListener('connectionStatus', handleConnectionChange);
    
    // Cleanup listeners on unmount
    return () => {
      bluetoothService.removeEventListener('emg', handleEMGData);
      bluetoothService.removeEventListener('imu', handleIMUData);
      bluetoothService.removeEventListener('connectionStatus', handleConnectionChange);
    };
  }, [isRecording, timeWindow]);

  // Generate mock signal data when not connected to real device
  useEffect(() => {
    // Only use mock data if not connected to a real device
    if (connectionStatus !== 'connected' && isRecording) {
      const generateMockSignal = () => {
        const timestamp = Date.now();
        const channels = Array.from({ length: 8 }, (_, i) => ({
          channel: i + 1,
          value: Math.sin(timestamp / 1000 + i) * 100 + Math.random() * 20,
          rms: Math.abs(Math.sin(timestamp / 500 + i)) * 50 + 25,
          quality: Math.random() > 0.1 ? 'good' : 'poor'
        }));

        setSignalData(prev => {
          const newData = [...prev, { timestamp, channels }];
          return newData.slice(-timeWindow * 10); // Keep last N seconds
        });

        // Mock IMU data
        setIMUData({
          accelerometer: {
            x: Math.sin(timestamp / 1000) * 2,
            y: Math.cos(timestamp / 1000) * 2,
            z: Math.sin(timestamp / 1500) * 2
          },
          gyroscope: {
            x: Math.cos(timestamp / 800) * 50,
            y: Math.sin(timestamp / 900) * 50,
            z: Math.cos(timestamp / 1100) * 50
          },
          quaternion: {
            w: Math.cos(timestamp / 2000),
            x: Math.sin(timestamp / 2000) * 0.5,
            y: Math.cos(timestamp / 2500) * 0.5,
            z: Math.sin(timestamp / 3000) * 0.5
          }
        });

        // Mock FFT data
        const fftChannels = Array.from({ length: 8 }, (_, i) => ({
          channel: i + 1,
          frequencies: Array.from({ length: 50 }, (_, f) => ({
            frequency: f * 2,
            magnitude: Math.random() * 100 * Math.exp(-f / 10)
          }))
        }));
        setFFTData(fftChannels);
      };

      intervalRef.current = setInterval(generateMockSignal, 100);
      return () => clearInterval(intervalRef.current);
    } else if (!isRecording) {
      clearInterval(intervalRef.current);
    }
  }, [isRecording, connectionStatus, timeWindow]);

  // Session timer
  useEffect(() => {
    let timer;
    if (isRecording) {
      timer = setInterval(() => {
        setSessionTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  // Initialize channel settings
  useEffect(() => {
    const initialSettings = {};
    for (let i = 1; i <= 8; i++) {
      initialSettings[i] = {
        muted: false,
        threshold: 75,
        color: `hsl(${(i - 1) * 45}, 70%, 60%)`
      };
    }
    setChannelSettings(initialSettings);
  }, []);

  const handleStartSession = () => {
    if (!selectedPatient) {
      alert('Please select a patient before starting the session.');
      return;
    }
    
    if (connectionStatus !== 'connected') {
      alert('Please connect to the Myo device before starting a session.');
      return;
    }
    
    setIsRecording(true);
    setSessionTimer(0);
    setSignalData([]);
  };

  const handleStopSession = () => {
    setIsRecording(false);
  };

  const handleEmergencyStop = () => {
    setIsRecording(false);
    setSessionTimer(0);
    setSignalData([]);
    alert('Emergency stop activated. Session terminated.');
  };

  const handleHapticToggle = async (enabled) => {
    setHapticFeedback(enabled);
    
    // Set haptic feedback on the actual device if connected
    if (connectionStatus === 'connected') {
      await bluetoothService.setHapticFeedback(enabled);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 py-6">
        {/* Header Section */}
        <div className="mb-6">
          <Breadcrumb />
          <div className="mt-4">
            <h1 className="text-2xl font-heading-bold text-text-primary mb-2">
              Real-Time Signal Monitoring
            </h1>
            <p className="text-text-secondary font-body-normal">
              Live EMG/IMU signal monitoring for active neurofeedback therapy sessions
            </p>
          </div>
        </div>

        {/* Session Controls */}
        <SessionControls
          patients={patients}
          selectedPatient={selectedPatient}
          onPatientSelect={setSelectedPatient}
          isRecording={isRecording}
          sessionTimer={formatTime(sessionTimer)}
          connectionStatus={connectionStatus}
          onConnectionStatusChange={setConnectionStatus}
          hapticFeedback={hapticFeedback}
          onHapticToggle={handleHapticToggle}
          onStartSession={handleStartSession}
          onStopSession={handleStopSession}
          onEmergencyStop={handleEmergencyStop}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-24 gap-6 mt-6">
          {/* Primary Visualization Area */}
          <div className="xl:col-span-16 space-y-6">
            {/* EMG Signal Charts */}
            <EMGSignalChart
              signalData={signalData}
              channelSettings={channelSettings}
              onChannelSettingsChange={setChannelSettings}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              timeWindow={timeWindow}
              onTimeWindowChange={setTimeWindow}
              isRecording={isRecording}
            />

            {/* IMU Data Panel */}
            <IMUDataPanel
              imuData={imuData}
              isRecording={isRecording}
            />
          </div>

          {/* Right Sidebar */}
          <div className="xl:col-span-8 space-y-6">
            {/* Real-time Metrics */}
            <RealTimeMetrics
              signalData={signalData}
              channelSettings={channelSettings}
              connectionStatus={connectionStatus}
            />
          </div>
        </div>

        {/* FFT Spectrum Analysis */}
        <div className="mt-6">
          <FFTSpectrumAnalysis
            fftData={fftData}
            channelSettings={channelSettings}
            isRecording={isRecording}
          />
        </div>
      </div>
    </div>
  );
};

export default RealTimeSignalMonitoringDashboard;