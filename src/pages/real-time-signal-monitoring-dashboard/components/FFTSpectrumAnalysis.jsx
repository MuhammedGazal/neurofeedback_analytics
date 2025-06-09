import React, { useState, useRef, useEffect } from 'react';
import Icon from 'components/AppIcon';

const FFTSpectrumAnalysis = ({ fftData, channelSettings, isRecording }) => {
  const canvasRef = useRef(null);
  const [selectedChannel, setSelectedChannel] = useState(1);
  const [frequencyRange, setFrequencyRange] = useState([0, 50]);
  const [showTremorBand, setShowTremorBand] = useState(true);
  const [logScale, setLogScale] = useState(false);

  // Tremor detection frequency band (4-7 Hz)
  const tremorBand = { min: 4, max: 7 };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !fftData.length) return;

    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    
    // Clear canvas
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)';
    ctx.lineWidth = 1;
    
    // Vertical grid lines (frequency)
    for (let i = 0; i <= 10; i++) {
      const x = (width / 10) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Horizontal grid lines (magnitude)
    for (let i = 0; i <= 8; i++) {
      const y = (height / 8) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw tremor band highlight
    if (showTremorBand) {
      const startX = (tremorBand.min / frequencyRange[1]) * width;
      const endX = (tremorBand.max / frequencyRange[1]) * width;
      
      ctx.fillStyle = 'rgba(239, 68, 68, 0.1)';
      ctx.fillRect(startX, 0, endX - startX, height);
      
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      
      ctx.beginPath();
      ctx.moveTo(startX, 0);
      ctx.lineTo(startX, height);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(endX, 0);
      ctx.lineTo(endX, height);
      ctx.stroke();
      
      ctx.setLineDash([]);
    }

    // Draw frequency spectrum
    const channelData = fftData.find(ch => ch.channel === selectedChannel);
    if (channelData && channelData.frequencies) {
      const channelColors = [
        '#00D4FF', '#7C3AED', '#10B981', '#F59E0B',
        '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16'
      ];
      
      ctx.strokeStyle = channelColors[selectedChannel - 1];
      ctx.fillStyle = channelColors[selectedChannel - 1] + '40';
      ctx.lineWidth = 2;
      
      ctx.beginPath();
      let firstPoint = true;
      
      channelData.frequencies.forEach((point, index) => {
        if (point.frequency >= frequencyRange[0] && point.frequency <= frequencyRange[1]) {
          const x = ((point.frequency - frequencyRange[0]) / (frequencyRange[1] - frequencyRange[0])) * width;
          const magnitude = logScale ? Math.log10(point.magnitude + 1) : point.magnitude;
          const maxMagnitude = logScale ? Math.log10(101) : 100;
          const y = height - (magnitude / maxMagnitude) * height;
          
          if (firstPoint) {
            ctx.moveTo(x, height);
            ctx.lineTo(x, y);
            firstPoint = false;
          } else {
            ctx.lineTo(x, y);
          }
        }
      });
      
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();
      
      // Draw outline
      ctx.beginPath();
      firstPoint = true;
      channelData.frequencies.forEach((point) => {
        if (point.frequency >= frequencyRange[0] && point.frequency <= frequencyRange[1]) {
          const x = ((point.frequency - frequencyRange[0]) / (frequencyRange[1] - frequencyRange[0])) * width;
          const magnitude = logScale ? Math.log10(point.magnitude + 1) : point.magnitude;
          const maxMagnitude = logScale ? Math.log10(101) : 100;
          const y = height - (magnitude / maxMagnitude) * height;
          
          if (firstPoint) {
            ctx.moveTo(x, y);
            firstPoint = false;
          } else {
            ctx.lineTo(x, y);
          }
        }
      });
      ctx.stroke();
    }

    // Draw frequency labels
    ctx.fillStyle = '#94A3B8';
    ctx.font = '10px Inter';
    ctx.textAlign = 'center';
    
    for (let i = 0; i <= 5; i++) {
      const freq = (frequencyRange[1] / 5) * i;
      const x = (width / 5) * i;
      ctx.fillText(`${freq.toFixed(0)}Hz`, x, height - 5);
    }

  }, [fftData, selectedChannel, frequencyRange, showTremorBand, logScale]);

  const getTremorDetection = () => {
    const channelData = fftData.find(ch => ch.channel === selectedChannel);
    if (!channelData || !channelData.frequencies) return { detected: false, magnitude: 0 };

    const tremorFreqs = channelData.frequencies.filter(
      f => f.frequency >= tremorBand.min && f.frequency <= tremorBand.max
    );
    
    if (tremorFreqs.length === 0) return { detected: false, magnitude: 0 };
    
    const avgMagnitude = tremorFreqs.reduce((sum, f) => sum + f.magnitude, 0) / tremorFreqs.length;
    const detected = avgMagnitude > 30; // Threshold for tremor detection
    
    return { detected, magnitude: avgMagnitude };
  };

  const tremorDetection = getTremorDetection();

  const getPeakFrequency = () => {
    const channelData = fftData.find(ch => ch.channel === selectedChannel);
    if (!channelData || !channelData.frequencies) return null;

    const peak = channelData.frequencies.reduce((max, current) => 
      current.magnitude > max.magnitude ? current : max
    );
    
    return peak;
  };

  const peakFrequency = getPeakFrequency();

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-lg font-heading-semibold text-text-primary mb-1">
            FFT Spectrum Analysis
          </h2>
          <p className="text-sm text-text-secondary">
            Frequency domain analysis with tremor detection
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Channel Selector */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-body-medium text-text-primary">Channel:</label>
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(parseInt(e.target.value))}
              className="px-3 py-1 bg-background border border-border rounded text-sm text-text-primary focus:border-primary focus:outline-none"
            >
              {Array.from({ length: 8 }, (_, i) => i + 1).map(ch => (
                <option key={ch} value={ch}>CH{ch}</option>
              ))}
            </select>
          </div>

          {/* Frequency Range */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-body-medium text-text-primary">Range:</label>
            <select
              value={`${frequencyRange[0]}-${frequencyRange[1]}`}
              onChange={(e) => {
                const [min, max] = e.target.value.split('-').map(Number);
                setFrequencyRange([min, max]);
              }}
              className="px-3 py-1 bg-background border border-border rounded text-sm text-text-primary focus:border-primary focus:outline-none"
            >
              <option value="0-50">0-50 Hz</option>
              <option value="0-25">0-25 Hz</option>
              <option value="0-10">0-10 Hz</option>
              <option value="4-12">4-12 Hz</option>
            </select>
          </div>

          {/* Scale Toggle */}
          <button
            onClick={() => setLogScale(!logScale)}
            className={`flex items-center space-x-2 px-3 py-1 rounded clinical-transition ${
              logScale 
                ? 'bg-primary text-background' :'bg-background border border-border text-text-secondary hover:text-text-primary'
            }`}
          >
            <Icon name="BarChart3" size={14} strokeWidth={2} />
            <span className="text-xs font-body-medium">
              {logScale ? 'Log' : 'Linear'}
            </span>
          </button>

          {/* Tremor Band Toggle */}
          <button
            onClick={() => setShowTremorBand(!showTremorBand)}
            className={`flex items-center space-x-2 px-3 py-1 rounded clinical-transition ${
              showTremorBand 
                ? 'bg-error/10 border border-error/30 text-error' :'bg-background border border-border text-text-secondary hover:text-text-primary'
            }`}
          >
            <Icon name="AlertTriangle" size={14} strokeWidth={2} />
            <span className="text-xs font-body-medium">Tremor Band</span>
          </button>
        </div>
      </div>

      {/* Spectrum Chart */}
      <div className="relative bg-background border border-border rounded-lg overflow-hidden mb-6">
        <canvas
          ref={canvasRef}
          width={800}
          height={300}
          className="w-full h-64"
        />
        
        {!isRecording && fftData.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Icon name="BarChart3" size={48} className="text-text-tertiary mx-auto mb-4" strokeWidth={1} />
              <p className="text-text-secondary font-body-normal">
                Start a session to begin frequency analysis
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Analysis Results */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tremor Detection */}
        <div className="bg-background border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-heading-semibold text-text-primary">
              Tremor Detection
            </h3>
            <div className={`w-3 h-3 rounded-full ${
              tremorDetection.detected ? 'bg-error pulse-alert' : 'bg-text-tertiary'
            }`} />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-text-secondary">Status:</span>
              <span className={`font-body-medium ${
                tremorDetection.detected ? 'text-error' : 'text-success'
              }`}>
                {tremorDetection.detected ? 'Detected' : 'Normal'}
              </span>
            </div>
            
            <div className="flex justify-between text-xs">
              <span className="text-text-secondary">Magnitude:</span>
              <span className="text-text-primary font-data-normal">
                {tremorDetection.magnitude.toFixed(1)}
              </span>
            </div>
            
            <div className="flex justify-between text-xs">
              <span className="text-text-secondary">Band:</span>
              <span className="text-text-primary font-data-normal">
                {tremorBand.min}-{tremorBand.max} Hz
              </span>
            </div>
          </div>
        </div>

        {/* Peak Frequency */}
        <div className="bg-background border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-heading-semibold text-text-primary">
              Peak Frequency
            </h3>
            <Icon name="TrendingUp" size={16} className="text-primary" strokeWidth={2} />
          </div>
          
          {peakFrequency ? (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-text-secondary">Frequency:</span>
                <span className="text-primary font-data-bold">
                  {peakFrequency.frequency.toFixed(1)} Hz
                </span>
              </div>
              
              <div className="flex justify-between text-xs">
                <span className="text-text-secondary">Magnitude:</span>
                <span className="text-text-primary font-data-normal">
                  {peakFrequency.magnitude.toFixed(1)}
                </span>
              </div>
              
              <div className="w-full bg-surface-700 rounded-full h-1.5 mt-2">
                <div 
                  className="h-1.5 bg-primary rounded-full clinical-transition"
                  style={{ width: `${Math.min((peakFrequency.magnitude / 100) * 100, 100)}%` }}
                />
              </div>
            </div>
          ) : (
            <p className="text-xs text-text-secondary">No data available</p>
          )}
        </div>

        {/* Signal Quality */}
        <div className="bg-background border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-heading-semibold text-text-primary">
              Signal Quality
            </h3>
            <Icon name="Signal" size={16} className="text-success" strokeWidth={2} />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-text-secondary">SNR:</span>
              <span className="text-success font-data-normal">
                {(Math.random() * 20 + 15).toFixed(1)} dB
              </span>
            </div>
            
            <div className="flex justify-between text-xs">
              <span className="text-text-secondary">Noise Floor:</span>
              <span className="text-text-primary font-data-normal">
                {(Math.random() * 5 + 2).toFixed(1)}
              </span>
            </div>
            
            <div className="flex justify-between text-xs">
              <span className="text-text-secondary">Quality:</span>
              <span className="text-success font-body-medium">
                Excellent
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FFTSpectrumAnalysis;