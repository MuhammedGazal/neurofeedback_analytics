import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import Icon from 'components/AppIcon';

const KPIMetrics = ({ sessionData, patient }) => {
  const latestSession = sessionData[sessionData.length - 1];
  const firstSession = sessionData[0];
  
  const calculateTrend = (current, previous) => {
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const metrics = [
    {
      id: 'effectiveness',
      title: 'Treatment Effectiveness',
      value: latestSession?.treatmentEffectiveness || 0,
      unit: '%',
      trend: calculateTrend(latestSession?.treatmentEffectiveness || 0, firstSession?.treatmentEffectiveness || 1),
      icon: 'TrendingUp',
      color: 'primary',
      sparklineData: sessionData.map(d => ({ value: d.treatmentEffectiveness })),
      description: 'Overall therapy session effectiveness score'
    },
    {
      id: 'tremor',
      title: 'Tremor Reduction',
      value: latestSession?.tremorReduction || 0,
      unit: '%',
      trend: calculateTrend(latestSession?.tremorReduction || 0, firstSession?.tremorReduction || 1),
      icon: 'Activity',
      color: 'accent',
      sparklineData: sessionData.map(d => ({ value: d.tremorReduction })),
      description: 'Reduction in tremor amplitude and frequency'
    },
    {
      id: 'fatigue',
      title: 'Muscle Fatigue Improvement',
      value: latestSession?.muscleFatigue || 0,
      unit: '%',
      trend: calculateTrend(latestSession?.muscleFatigue || 0, firstSession?.muscleFatigue || 1),
      icon: 'Zap',
      color: 'secondary',
      sparklineData: sessionData.map(d => ({ value: d.muscleFatigue })),
      description: 'Improvement in muscle endurance and strength'
    },
    {
      id: 'engagement',
      title: 'Patient Engagement',
      value: latestSession?.engagement || 0,
      unit: '%',
      trend: calculateTrend(latestSession?.engagement || 0, firstSession?.engagement || 1),
      icon: 'Heart',
      color: 'warning',
      sparklineData: sessionData.map(d => ({ value: d.engagement })),
      description: 'Patient participation and therapy compliance'
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      primary: {
        bg: 'bg-primary/10',
        border: 'border-primary/20',
        text: 'text-primary',
        icon: 'text-primary'
      },
      accent: {
        bg: 'bg-accent/10',
        border: 'border-accent/20',
        text: 'text-accent',
        icon: 'text-accent'
      },
      secondary: {
        bg: 'bg-secondary/10',
        border: 'border-secondary/20',
        text: 'text-secondary',
        icon: 'text-secondary'
      },
      warning: {
        bg: 'bg-warning/10',
        border: 'border-warning/20',
        text: 'text-warning',
        icon: 'text-warning'
      }
    };
    return colorMap[color] || colorMap.primary;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => {
        const colors = getColorClasses(metric.color);
        const isPositiveTrend = parseFloat(metric.trend) >= 0;
        
        return (
          <div
            key={metric.id}
            className={`bg-surface border ${colors.border} rounded-lg p-6 clinical-transition hover:shadow-lg`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center`}>
                <Icon 
                  name={metric.icon} 
                  size={24} 
                  className={colors.icon} 
                  strokeWidth={2}
                />
              </div>
              
              <div className="text-right">
                <div className={`flex items-center space-x-1 text-sm ${
                  isPositiveTrend ? 'text-success' : 'text-error'
                }`}>
                  <Icon 
                    name={isPositiveTrend ? 'TrendingUp' : 'TrendingDown'} 
                    size={14} 
                    strokeWidth={2}
                  />
                  <span className="font-data-normal">
                    {Math.abs(parseFloat(metric.trend))}%
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-body-medium text-text-secondary mb-1">
                {metric.title}
              </h3>
              <div className="flex items-baseline space-x-1">
                <span className={`text-3xl font-heading-bold ${colors.text}`}>
                  {metric.value}
                </span>
                <span className="text-lg text-text-secondary font-body-normal">
                  {metric.unit}
                </span>
              </div>
              <p className="text-xs text-text-tertiary mt-1">
                {metric.description}
              </p>
            </div>

            {/* Sparkline Chart */}
            <div className="h-12">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metric.sparklineData}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={`var(--color-${metric.color})`}
                    strokeWidth={2}
                    dot={false}
                    activeDot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Session Count */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <span className="text-xs text-text-tertiary">
                Based on {sessionData.length} sessions
              </span>
              <div className="flex items-center space-x-1 text-xs text-text-secondary">
                <Icon name="Calendar" size={12} strokeWidth={2} />
                <span>{patient?.lastSession}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KPIMetrics;