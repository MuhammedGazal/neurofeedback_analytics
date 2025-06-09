import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const SessionStatistics = ({ sessionData, patient }) => {
  const [sortField, setSortField] = useState('session');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedSession, setSelectedSession] = useState(null);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedData = [...sessionData].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    
    if (sortDirection === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const columns = [
    { key: 'session', label: 'Session', icon: 'Hash' },
    { key: 'date', label: 'Date', icon: 'Calendar' },
    { key: 'treatmentEffectiveness', label: 'Effectiveness', icon: 'TrendingUp', unit: '%' },
    { key: 'engagement', label: 'Engagement', icon: 'Heart', unit: '%' },
    { key: 'thresholdAchievements', label: 'Achievements', icon: 'Target' }
  ];

  const getPerformanceColor = (value, type) => {
    if (type === 'effectiveness' || type === 'engagement') {
      if (value >= 90) return 'text-success';
      if (value >= 70) return 'text-warning';
      return 'text-error';
    }
    return 'text-text-primary';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-heading-semibold text-text-primary">
          Session Statistics
        </h3>
        <div className="flex items-center space-x-2">
          <Icon name="BarChart3" size={20} className="text-accent" strokeWidth={2} />
          <span className="text-sm text-text-secondary">
            {sessionData.length} sessions
          </span>
        </div>
      </div>

      {/* Statistics Table */}
      <div className="overflow-hidden rounded-lg border border-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-700">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-4 py-3 text-left cursor-pointer hover:bg-surface-600 clinical-transition"
                    onClick={() => handleSort(column.key)}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon name={column.icon} size={14} className="text-text-secondary" strokeWidth={2} />
                      <span className="text-xs font-body-medium text-text-secondary">
                        {column.label}
                      </span>
                      {sortField === column.key && (
                        <Icon 
                          name={sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                          size={12} 
                          className="text-primary" 
                          strokeWidth={2}
                        />
                      )}
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3 text-left">
                  <span className="text-xs font-body-medium text-text-secondary">
                    Actions
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sortedData.map((session, index) => (
                <tr 
                  key={session.session}
                  className="hover:bg-surface-700 clinical-transition"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                        <span className="text-xs font-data-normal text-primary">
                          {session.session}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-data-normal text-text-primary">
                      {formatDate(session.date)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-data-normal ${getPerformanceColor(session.treatmentEffectiveness, 'effectiveness')}`}>
                      {session.treatmentEffectiveness}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-data-normal ${getPerformanceColor(session.engagement, 'engagement')}`}>
                      {session.engagement}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-data-normal text-text-primary">
                      {session.thresholdAchievements}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedSession(session)}
                      className="flex items-center space-x-1 px-2 py-1 bg-primary/10 text-primary rounded clinical-transition hover:bg-primary/20"
                    >
                      <Icon name="Eye" size={12} strokeWidth={2} />
                      <span className="text-xs font-body-medium">View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Session Summary Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-surface-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="TrendingUp" size={16} className="text-success" strokeWidth={2} />
            <span className="text-sm font-body-medium text-text-secondary">
              Average Effectiveness
            </span>
          </div>
          <span className="text-xl font-heading-semibold text-success">
            {(sessionData.reduce((sum, s) => sum + s.treatmentEffectiveness, 0) / sessionData.length).toFixed(1)}%
          </span>
        </div>

        <div className="bg-surface-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Target" size={16} className="text-warning" strokeWidth={2} />
            <span className="text-sm font-body-medium text-text-secondary">
              Total Achievements
            </span>
          </div>
          <span className="text-xl font-heading-semibold text-warning">
            {sessionData.reduce((sum, s) => sum + s.thresholdAchievements, 0)}
          </span>
        </div>
      </div>

      {/* Session Detail Modal */}
      {selectedSession && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-border rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-heading-semibold text-text-primary">
                Session {selectedSession.session} Details
              </h4>
              <button
                onClick={() => setSelectedSession(null)}
                className="p-2 hover:bg-surface-700 rounded-lg clinical-transition"
              >
                <Icon name="X" size={16} className="text-text-secondary" strokeWidth={2} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-text-secondary">Date</span>
                  <p className="font-data-normal text-text-primary">{selectedSession.date}</p>
                </div>
                <div>
                  <span className="text-sm text-text-secondary">RMS Average</span>
                  <p className="font-data-normal text-text-primary">{selectedSession.rmsAverage}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-text-secondary">FFT Power</span>
                  <p className="font-data-normal text-text-primary">{selectedSession.fftPower}</p>
                </div>
                <div>
                  <span className="text-sm text-text-secondary">Tremor Reduction</span>
                  <p className="font-data-normal text-success">{selectedSession.tremorReduction}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionStatistics;