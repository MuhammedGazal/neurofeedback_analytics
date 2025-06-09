import React, { useState, useEffect, useRef } from 'react';
import Icon from 'components/AppIcon';

const EMGSignalChart = ({
  signalData,
  channelSettings,
  onChannelSettingsChange,
  viewMode,
  onViewModeChange,
  timeWindow,
  onTimeWindowChange,
  isRecording
}) => {
  const canvasRef = useRef(null);
  const [amplitudeScale, setAmplitudeScale] = useState(1);
  const [selectedChannels, setSelectedChannels] = useState(new Set([1, 2, 3, 4, 5, 6, 7, 8]));

  // Channel colors
  const channelColors = [
    '#00D4FF', '#7C3AED', '#10B981', '#F59E0B',
    '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16'
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !signalData.length) return;

    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    
    // Clear canvas
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)';
    ctx.lineWidth = 1;
    
    // Vertical grid lines
    for (let i = 0; i <= 10; i++) {
      const x = (width / 10) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Horizontal grid lines
    for (let i = 0; i <= 8; i++) {
      const y = (height / 8) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw signals
    if (signalData.length > 1) {
      selectedChannels.forEach(channelNum => {
        if (channelSettings[channelNum]?.muted) return;

        ctx.strokeStyle = channelColors[channelNum - 1];
        ctx.lineWidth = 2;
        ctx.beginPath();

        let firstPoint = true;
        signalData.forEach((dataPoint, index) => {
          const channel = dataPoint.channels.find(c => c.channel === channelNum);
          if (!channel) return;

          const x = (index / (signalData.length - 1)) * width;
          const normalizedValue = (channel.value * amplitudeScale) / 200; // Normalize to -1 to 1
          const y = height / 2 - (normalizedValue * height / 4);

          if (firstPoint) {
            ctx.moveTo(x, y);
            firstPoint = false;
          } else {
            ctx.lineTo(x, y);
          }
        });

        ctx.stroke();
      });
    }

    // Draw threshold lines
    selectedChannels.forEach(channelNum => {
      if (channelSettings[channelNum]?.muted) return;
      
      const threshold = channelSettings[channelNum]?.threshold || 75;
      const thresholdY = height / 2 - (threshold * amplitudeScale / 200) * height / 4;
      
      ctx.strokeStyle = channelColors[channelNum - 1];
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.5;
      
      ctx.beginPath();
      ctx.moveTo(0, thresholdY);
      ctx.lineTo(width, thresholdY);
      ctx.stroke();
      
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
    });

  }, [signalData, channelSettings, selectedChannels, amplitudeScale]);

  const toggleChannel = (channelNum) => {
    const newSelected = new Set(selectedChannels);
    if (newSelected.has(channelNum)) {
      newSelected.delete(channelNum);
    } else {
      newSelected.add(channelNum);
    }
    setSelectedChannels(newSelected);
  };

  const toggleChannelMute = (channelNum) => {
    const newSettings = {
      ...channelSettings,
      [channelNum]: {
        ...channelSettings[channelNum],
        muted: !channelSettings[channelNum]?.muted
      }
    };
    onChannelSettingsChange(newSettings);
  };

  const updateThreshold = (channelNum, threshold) => {
    const newSettings = {
      ...channelSettings,
      [channelNum]: {
        ...channelSettings[channelNum],
        threshold: parseInt(threshold)
      }
    };
    onChannelSettingsChange(newSettings);
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      {/* Chart Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-lg font-heading-semibold text-text-primary mb-1">
            EMG Signal Visualization
          </h2>
          <p className="text-sm text-text-secondary">
            8-channel real-time electromyography monitoring
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-body-medium text-text-primary">View:</label>
            <div className="flex bg-background border border-border rounded-lg p-1">
              <button
                onClick={() => onViewModeChange('raw')}
                className={`px-3 py-1 text-xs font-body-medium rounded clinical-transition ${
                  viewMode === 'raw' ?'bg-primary text-background' :'text-text-secondary hover:text-text-primary'
                }`}
              >
                Raw
              </button>
              <button
                onClick={() => onViewModeChange('filtered')}
                className={`px-3 py-1 text-xs font-body-medium rounded clinical-transition ${
                  viewMode === 'filtered' ?'bg-primary text-background' :'text-text-secondary hover:text-text-primary'
                }`}
              >
                Filtered
              </button>
            </div>
          </div>

          {/* Time Window */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-body-medium text-text-primary">Window:</label>
            <select
              value={timeWindow}
              onChange={(e) => onTimeWindowChange(parseInt(e.target.value))}
              className="px-3 py-1 bg-background border border-border rounded text-sm text-text-primary focus:border-primary focus:outline-none"
            >
              <option value={5}>5s</option>
              <option value={10}>10s</option>
              <option value={30}>30s</option>
              <option value={60}>60s</option>
            </select>
          </div>

          {/* Amplitude Scale */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-body-medium text-text-primary">Scale:</label>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={amplitudeScale}
              onChange={(e) => setAmplitudeScale(parseFloat(e.target.value))}
              className="w-20"
            />
            <span className="text-xs text-text-secondary w-8">{amplitudeScale.toFixed(1)}x</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="relative bg-background border border-border rounded-lg overflow-hidden mb-6">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="w-full h-80"
        />
        
        {!isRecording && signalData.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Icon name="Activity" size={48} className="text-text-tertiary mx-auto mb-4" strokeWidth={1} />
              <p className="text-text-secondary font-body-normal">
                Start a session to begin signal monitoring
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Channel Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }, (_, i) => i + 1).map(channelNum => (
          <div key={channelNum} className="bg-background border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: channelColors[channelNum - 1] }}
                />
                <span className="text-sm font-body-medium text-text-primary">
                  CH{channelNum}
                </span>
              </div>
              
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => toggleChannel(channelNum)}
                  className={`p-1 rounded clinical-transition ${
                    selectedChannels.has(channelNum)
                      ? 'text-primary hover:text-primary-600' :'text-text-tertiary hover:text-text-secondary'
                  }`}
                  title={selectedChannels.has(channelNum) ? 'Hide channel' : 'Show channel'}
                >
                  <Icon name={selectedChannels.has(channelNum) ? "Eye" : "EyeOff"} size={14} strokeWidth={2} />
                </button>
                
                <button
                  onClick={() => toggleChannelMute(channelNum)}
                  className={`p-1 rounded clinical-transition ${
                    channelSettings[channelNum]?.muted
                      ? 'text-error hover:text-error-600' :'text-text-tertiary hover:text-text-secondary'
                  }`}
                  title={channelSettings[channelNum]?.muted ? 'Unmute channel' : 'Mute channel'}
                >
                  <Icon name={channelSettings[channelNum]?.muted ? "VolumeX" : "Volume2"} size={14} strokeWidth={2} />
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary">Threshold:</span>
                <span className="text-text-primary font-data-normal">
                  {channelSettings[channelNum]?.threshold || 75}μV
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="150"
                value={channelSettings[channelNum]?.threshold || 75}
                onChange={(e) => updateThreshold(channelNum, e.target.value)}
                className="w-full h-1 bg-surface-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EMGSignalChart;