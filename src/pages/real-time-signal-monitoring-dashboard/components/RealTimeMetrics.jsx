import React from 'react';
import Icon from 'components/AppIcon';

const RealTimeMetrics = ({ signalData, channelSettings, connectionStatus }) => {
  // Calculate real-time metrics from latest signal data
  const getLatestMetrics = () => {
    if (!signalData.length) return null;
    
    const latest = signalData[signalData.length - 1];
    return latest.channels.map(channel => ({
      ...channel,
      thresholdBreach: channel.rms > (channelSettings[channel.channel]?.threshold || 75),
      signalStrength: channel.rms > 50 ? 'strong' : channel.rms > 25 ? 'medium' : 'weak'
    }));
  };

  const metrics = getLatestMetrics();
  const activeChannels = metrics ? metrics.filter(m => !channelSettings[m.channel]?.muted) : [];
  const breachCount = activeChannels.filter(m => m.thresholdBreach).length;
  const avgSignalQuality = activeChannels.length > 0 
    ? activeChannels.filter(m => m.quality === 'good').length / activeChannels.length * 100 
    : 0;

  const getQualityColor = (quality) => {
    switch (quality) {
      case 'good': return 'text-success';
      case 'poor': return 'text-error';
      default: return 'text-warning';
    }
  };

  const getSignalStrengthColor = (strength) => {
    switch (strength) {
      case 'strong': return 'text-success';
      case 'medium': return 'text-warning';
      case 'weak': return 'text-error';
      default: return 'text-text-tertiary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Connection & System Status */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <h3 className="text-lg font-heading-semibold text-text-primary mb-4">
          System Status
        </h3>
        
        <div className="space-y-4">
          {/* Connection Status */}
          <div className="flex items-center justify-between p-3 bg-background border border-border rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon 
                name="Wifi" 
                size={16} 
                className={connectionStatus === 'connected' ? 'text-success' : 'text-error'}
                strokeWidth={2}
              />
              <span className="text-sm font-body-medium text-text-primary">
                Device Connection
              </span>
            </div>
            <span className={`text-sm font-body-medium ${
              connectionStatus === 'connected' ? 'text-success' : 'text-error'
            }`}>
              {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          {/* Signal Quality */}
          <div className="flex items-center justify-between p-3 bg-background border border-border rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon 
                name="Signal" 
                size={16} 
                className={avgSignalQuality > 80 ? 'text-success' : avgSignalQuality > 50 ? 'text-warning' : 'text-error'}
                strokeWidth={2}
              />
              <span className="text-sm font-body-medium text-text-primary">
                Signal Quality
              </span>
            </div>
            <span className={`text-sm font-body-medium ${
              avgSignalQuality > 80 ? 'text-success' : avgSignalQuality > 50 ? 'text-warning' : 'text-error'
            }`}>
              {avgSignalQuality.toFixed(0)}%
            </span>
          </div>

          {/* Threshold Breaches */}
          <div className="flex items-center justify-between p-3 bg-background border border-border rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon 
                name="AlertTriangle" 
                size={16} 
                className={breachCount > 0 ? 'text-warning' : 'text-text-tertiary'}
                strokeWidth={2}
              />
              <span className="text-sm font-body-medium text-text-primary">
                Active Alerts
              </span>
            </div>
            <span className={`text-sm font-body-medium ${
              breachCount > 0 ? 'text-warning' : 'text-text-tertiary'
            }`}>
              {breachCount}
            </span>
          </div>
        </div>
      </div>

      {/* Real-time Channel Metrics */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <h3 className="text-lg font-heading-semibold text-text-primary mb-4">
          Channel Metrics
        </h3>
        
        {metrics ? (
          <div className="space-y-3">
            {metrics.map(channel => (
              <div 
                key={channel.channel}
                className={`p-3 rounded-lg border clinical-transition ${
                  channelSettings[channel.channel]?.muted 
                    ? 'bg-background/50 border-border opacity-50' 
                    : channel.thresholdBreach
                      ? 'bg-warning/10 border-warning/30' :'bg-background border-border'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ 
                        backgroundColor: channelSettings[channel.channel]?.muted 
                          ? '#64748B' 
                          : `hsl(${(channel.channel - 1) * 45}, 70%, 60%)`
                      }}
                    />
                    <span className="text-sm font-body-medium text-text-primary">
                      Channel {channel.channel}
                    </span>
                    {channel.thresholdBreach && (
                      <Icon name="AlertCircle" size={12} className="text-warning" strokeWidth={2} />
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`text-xs font-data-normal ${getQualityColor(channel.quality)}`}>
                      {channel.quality.toUpperCase()}
                    </span>
                    <span className={`text-xs font-data-normal ${getSignalStrengthColor(channel.signalStrength)}`}>
                      {channel.signalStrength.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-text-secondary">RMS:</span>
                    <span className="ml-2 font-data-normal text-text-primary">
                      {channel.rms.toFixed(1)}μV
                    </span>
                  </div>
                  <div>
                    <span className="text-text-secondary">Threshold:</span>
                    <span className="ml-2 font-data-normal text-text-primary">
                      {channelSettings[channel.channel]?.threshold || 75}μV
                    </span>
                  </div>
                </div>
                
                {/* RMS Progress Bar */}
                <div className="mt-2">
                  <div className="w-full bg-surface-700 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full clinical-transition ${
                        channel.thresholdBreach ? 'bg-warning' : 'bg-primary'
                      }`}
                      style={{ 
                        width: `${Math.min((channel.rms / 150) * 100, 100)}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Icon name="Activity" size={32} className="text-text-tertiary mx-auto mb-3" strokeWidth={1} />
            <p className="text-sm text-text-secondary">
              No signal data available
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <h3 className="text-lg font-heading-semibold text-text-primary mb-4">
          Quick Actions
        </h3>
        
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-3 bg-background border border-border rounded-lg clinical-transition hover:bg-surface-700">
            <div className="flex items-center space-x-3">
              <Icon name="Download" size={16} className="text-text-secondary" strokeWidth={2} />
              <span className="text-sm font-body-medium text-text-primary">
                Export Data
              </span>
            </div>
            <Icon name="ChevronRight" size={14} className="text-text-tertiary" strokeWidth={2} />
          </button>
          
          <button className="w-full flex items-center justify-between p-3 bg-background border border-border rounded-lg clinical-transition hover:bg-surface-700">
            <div className="flex items-center space-x-3">
              <Icon name="Settings" size={16} className="text-text-secondary" strokeWidth={2} />
              <span className="text-sm font-body-medium text-text-primary">
                Calibrate Sensors
              </span>
            </div>
            <Icon name="ChevronRight" size={14} className="text-text-tertiary" strokeWidth={2} />
          </button>
          
          <button className="w-full flex items-center justify-between p-3 bg-background border border-border rounded-lg clinical-transition hover:bg-surface-700">
            <div className="flex items-center space-x-3">
              <Icon name="FileText" size={16} className="text-text-secondary" strokeWidth={2} />
              <span className="text-sm font-body-medium text-text-primary">
                Session Notes
              </span>
            </div>
            <Icon name="ChevronRight" size={14} className="text-text-tertiary" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RealTimeMetrics;