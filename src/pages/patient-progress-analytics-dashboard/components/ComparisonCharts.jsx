import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import Icon from 'components/AppIcon';

const ComparisonCharts = ({ beforeAfterData, sessionData }) => {
  const [activeComparison, setActiveComparison] = useState('frequency');

  const comparisonOptions = [
    { id: 'frequency', label: 'Frequency Domain', icon: 'BarChart3' },
    { id: 'amplitude', label: 'Signal Amplitude', icon: 'Activity' },
    { id: 'statistical', label: 'Statistical Analysis', icon: 'PieChart' }
  ];

  // Mock amplitude comparison data
  const amplitudeComparisonData = [
    {
      muscle: 'Flexor Carpi',
      before: 0.85,
      after: 0.32,
      improvement: 62,
      significance: 'p < 0.001'
    },
    {
      muscle: 'Extensor Carpi',
      before: 0.78,
      after: 0.28,
      improvement: 64,
      significance: 'p < 0.001'
    },
    {
      muscle: 'Biceps Brachii',
      before: 0.92,
      after: 0.35,
      improvement: 62,
      significance: 'p < 0.002'
    },
    {
      muscle: 'Triceps Brachii',
      before: 0.67,
      after: 0.25,
      improvement: 63,
      significance: 'p < 0.001'
    }
  ];

  // Mock statistical analysis data
  const statisticalData = [
    {
      metric: 'Mean RMS',
      baseline: 0.82,
      current: 0.31,
      change: -62.2,
      pValue: '< 0.001',
      effect: 'Large'
    },
    {
      metric: 'Peak Frequency',
      baseline: 5.8,
      current: 4.2,
      change: -27.6,
      pValue: '< 0.01',
      effect: 'Medium'
    },
    {
      metric: 'Signal Variability',
      baseline: 0.45,
      current: 0.18,
      change: -60.0,
      pValue: '< 0.001',
      effect: 'Large'
    },
    {
      metric: 'Tremor Episodes',
      baseline: 28,
      current: 8,
      change: -71.4,
      pValue: '< 0.001',
      effect: 'Large'
    }
  ];

  const getComparisonData = () => {
    switch (activeComparison) {
      case 'amplitude':
        return amplitudeComparisonData;
      case 'statistical':
        return statisticalData;
      default:
        return beforeAfterData;
    }
  };

  const getEffectSizeColor = (effect) => {
    switch (effect) {
      case 'Large':
        return 'text-success bg-success/10 border-success/20';
      case 'Medium':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'Small':
        return 'text-error bg-error/10 border-error/20';
      default:
        return 'text-text-secondary bg-surface-700 border-border';
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h3 className="text-lg font-heading-semibold text-text-primary mb-2">
            Before/After Treatment Comparison
          </h3>
          <p className="text-sm text-text-secondary">
            Statistical analysis of treatment efficacy with significance indicators
          </p>
        </div>
        
        <div className="flex items-center space-x-2 mt-4 lg:mt-0">
          {comparisonOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setActiveComparison(option.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg clinical-transition text-sm font-body-medium ${
                activeComparison === option.id
                  ? 'bg-primary text-background' :'bg-surface-700 text-text-secondary hover:text-text-primary hover:bg-surface-600'
              }`}
            >
              <Icon name={option.icon} size={14} strokeWidth={2} />
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart Visualization */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {activeComparison === 'frequency' ? (
              <BarChart data={getComparisonData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis 
                  dataKey="frequency" 
                  stroke="#94A3B8"
                  fontSize={12}
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
                <Bar
                  dataKey="before"
                  fill="#EF4444"
                  radius={[4, 4, 0, 0]}
                  name="Before Treatment"
                />
                <Bar
                  dataKey="after"
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                  name="After Treatment"
                />
              </BarChart>
            ) : activeComparison === 'amplitude' ? (
              <BarChart data={getComparisonData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis 
                  dataKey="muscle" 
                  stroke="#94A3B8"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
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
                <Bar
                  dataKey="before"
                  fill="#EF4444"
                  radius={[4, 4, 0, 0]}
                  name="Before Treatment"
                />
                <Bar
                  dataKey="after"
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                  name="After Treatment"
                />
              </BarChart>
            ) : (
              <ComposedChart data={getComparisonData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis 
                  dataKey="metric" 
                  stroke="#94A3B8"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
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
                  dataKey="change"
                  fill="#00D4FF"
                  radius={[4, 4, 0, 0]}
                  name="Percentage Change"
                />
              </ComposedChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Statistical Summary */}
        <div className="space-y-4">
          <h4 className="text-md font-heading-semibold text-text-primary">
            Statistical Summary
          </h4>
          
          {activeComparison === 'statistical' ? (
            <div className="space-y-3">
              {statisticalData.map((stat, index) => (
                <div key={index} className="bg-surface-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-body-medium text-text-primary">
                      {stat.metric}
                    </span>
                    <div className={`px-2 py-1 rounded text-xs font-body-medium border ${getEffectSizeColor(stat.effect)}`}>
                      {stat.effect}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-text-secondary">Baseline</span>
                      <p className="font-data-normal text-text-primary">{stat.baseline}</p>
                    </div>
                    <div>
                      <span className="text-text-secondary">Current</span>
                      <p className="font-data-normal text-text-primary">{stat.current}</p>
                    </div>
                    <div>
                      <span className="text-text-secondary">Change</span>
                      <p className={`font-data-normal ${stat.change < 0 ? 'text-success' : 'text-error'}`}>
                        {stat.change}%
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-2 pt-2 border-t border-border">
                    <span className="text-xs text-text-secondary">
                      p-value: {stat.pValue}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {getComparisonData().map((item, index) => (
                <div key={index} className="bg-surface-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-body-medium text-text-primary">
                      {item.frequency || item.muscle}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Icon name="TrendingDown" size={14} className="text-success" strokeWidth={2} />
                      <span className="text-sm font-data-normal text-success">
                        {item.improvement}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-text-secondary">Before</span>
                      <p className="font-data-normal text-error">{item.before}</p>
                    </div>
                    <div>
                      <span className="text-text-secondary">After</span>
                      <p className="font-data-normal text-success">{item.after}</p>
                    </div>
                  </div>
                  
                  {item.significance && (
                    <div className="mt-2 pt-2 border-t border-border">
                      <span className="text-xs text-text-secondary">
                        Significance: {item.significance}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Overall Improvement Summary */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mt-6">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Award" size={16} className="text-primary" strokeWidth={2} />
              <span className="text-sm font-body-medium text-primary">
                Overall Treatment Efficacy
              </span>
            </div>
            <div className="text-2xl font-heading-bold text-primary mb-1">
              68.5%
            </div>
            <p className="text-xs text-text-secondary">
              Average improvement across all measured parameters with statistical significance (p &lt; 0.001)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonCharts;