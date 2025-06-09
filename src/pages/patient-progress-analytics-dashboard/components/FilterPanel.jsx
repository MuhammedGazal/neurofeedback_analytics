import React from 'react';
import Icon from 'components/AppIcon';

const FilterPanel = ({ selectedFilters, onFiltersChange }) => {
  const filterOptions = {
    muscleGroups: [
      { value: 'all', label: 'All Muscle Groups' },
      { value: 'flexor-carpi', label: 'Flexor Carpi' },
      { value: 'extensor-carpi', label: 'Extensor Carpi' },
      { value: 'biceps-brachii', label: 'Biceps Brachii' },
      { value: 'triceps-brachii', label: 'Triceps Brachii' },
      { value: 'deltoid', label: 'Deltoid' },
      { value: 'forearm-flexors', label: 'Forearm Flexors' },
      { value: 'forearm-extensors', label: 'Forearm Extensors' }
    ],
    therapyProtocols: [
      { value: 'all', label: 'All Protocols' },
      { value: 'tremor-suppression', label: 'Tremor Suppression' },
      { value: 'muscle-strengthening', label: 'Muscle Strengthening' },
      { value: 'coordination-training', label: 'Coordination Training' },
      { value: 'fatigue-management', label: 'Fatigue Management' },
      { value: 'biofeedback-basic', label: 'Basic Biofeedback' },
      { value: 'biofeedback-advanced', label: 'Advanced Biofeedback' }
    ],
    treatmentPhases: [
      { value: 'all', label: 'All Phases' },
      { value: 'baseline', label: 'Baseline Assessment' },
      { value: 'initial-training', label: 'Initial Training' },
      { value: 'skill-development', label: 'Skill Development' },
      { value: 'maintenance', label: 'Maintenance' },
      { value: 'follow-up', label: 'Follow-up' }
    ]
  };

  const handleFilterChange = (category, value) => {
    const updatedFilters = { ...selectedFilters };
    
    if (value === 'all') {
      updatedFilters[category] = ['all'];
    } else {
      if (updatedFilters[category].includes('all')) {
        updatedFilters[category] = [value];
      } else {
        if (updatedFilters[category].includes(value)) {
          updatedFilters[category] = updatedFilters[category].filter(v => v !== value);
          if (updatedFilters[category].length === 0) {
            updatedFilters[category] = ['all'];
          }
        } else {
          updatedFilters[category] = [...updatedFilters[category], value];
        }
      }
    }
    
    onFiltersChange(updatedFilters);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      muscleGroups: ['all'],
      therapyProtocols: ['all'],
      treatmentPhases: ['all']
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    Object.keys(selectedFilters).forEach(category => {
      if (!selectedFilters[category].includes('all')) {
        count += selectedFilters[category].length;
      }
    });
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={20} className="text-accent" strokeWidth={2} />
          <h3 className="text-lg font-heading-semibold text-text-primary">
            Analysis Filters
          </h3>
          {activeFilterCount > 0 && (
            <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
              <span className="text-xs font-data-normal text-background">
                {activeFilterCount}
              </span>
            </div>
          )}
        </div>
        
        {activeFilterCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-text-secondary hover:text-text-primary clinical-transition"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Muscle Groups Filter */}
        <div>
          <label className="block text-sm font-body-medium text-text-secondary mb-3">
            Muscle Groups
          </label>
          <div className="space-y-2">
            {filterOptions.muscleGroups.map((option) => (
              <label
                key={option.value}
                className="flex items-center space-x-3 cursor-pointer group"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selectedFilters.muscleGroups.includes(option.value)}
                    onChange={() => handleFilterChange('muscleGroups', option.value)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 border-2 rounded clinical-transition ${
                    selectedFilters.muscleGroups.includes(option.value)
                      ? 'bg-primary border-primary' :'border-border group-hover:border-primary/50'
                  }`}>
                    {selectedFilters.muscleGroups.includes(option.value) && (
                      <Icon 
                        name="Check" 
                        size={12} 
                        className="text-background absolute top-0 left-0" 
                        strokeWidth={3}
                      />
                    )}
                  </div>
                </div>
                <span className="text-sm text-text-primary group-hover:text-primary clinical-transition">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Therapy Protocols Filter */}
        <div>
          <label className="block text-sm font-body-medium text-text-secondary mb-3">
            Therapy Protocols
          </label>
          <div className="space-y-2">
            {filterOptions.therapyProtocols.map((option) => (
              <label
                key={option.value}
                className="flex items-center space-x-3 cursor-pointer group"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selectedFilters.therapyProtocols.includes(option.value)}
                    onChange={() => handleFilterChange('therapyProtocols', option.value)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 border-2 rounded clinical-transition ${
                    selectedFilters.therapyProtocols.includes(option.value)
                      ? 'bg-secondary border-secondary' :'border-border group-hover:border-secondary/50'
                  }`}>
                    {selectedFilters.therapyProtocols.includes(option.value) && (
                      <Icon 
                        name="Check" 
                        size={12} 
                        className="text-background absolute top-0 left-0" 
                        strokeWidth={3}
                      />
                    )}
                  </div>
                </div>
                <span className="text-sm text-text-primary group-hover:text-secondary clinical-transition">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Treatment Phases Filter */}
        <div>
          <label className="block text-sm font-body-medium text-text-secondary mb-3">
            Treatment Phases
          </label>
          <div className="space-y-2">
            {filterOptions.treatmentPhases.map((option) => (
              <label
                key={option.value}
                className="flex items-center space-x-3 cursor-pointer group"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selectedFilters.treatmentPhases.includes(option.value)}
                    onChange={() => handleFilterChange('treatmentPhases', option.value)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 border-2 rounded clinical-transition ${
                    selectedFilters.treatmentPhases.includes(option.value)
                      ? 'bg-accent border-accent' :'border-border group-hover:border-accent/50'
                  }`}>
                    {selectedFilters.treatmentPhases.includes(option.value) && (
                      <Icon 
                        name="Check" 
                        size={12} 
                        className="text-background absolute top-0 left-0" 
                        strokeWidth={3}
                      />
                    )}
                  </div>
                </div>
                <span className="text-sm text-text-primary group-hover:text-accent clinical-transition">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Bookmark Filters */}
        <div className="pt-4 border-t border-border">
          <label className="block text-sm font-body-medium text-text-secondary mb-3">
            Saved Filter Sets
          </label>
          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 bg-surface-700 rounded-lg clinical-transition hover:bg-surface-600 text-sm text-text-primary">
              <div className="flex items-center space-x-2">
                <Icon name="Bookmark" size={14} className="text-warning" strokeWidth={2} />
                <span>Tremor Analysis Set</span>
              </div>
            </button>
            <button className="w-full text-left px-3 py-2 bg-surface-700 rounded-lg clinical-transition hover:bg-surface-600 text-sm text-text-primary">
              <div className="flex items-center space-x-2">
                <Icon name="Bookmark" size={14} className="text-primary" strokeWidth={2} />
                <span>Muscle Fatigue Focus</span>
              </div>
            </button>
            <button className="w-full text-left px-3 py-2 border border-dashed border-border rounded-lg clinical-transition hover:border-primary text-sm text-text-secondary hover:text-primary">
              <div className="flex items-center space-x-2">
                <Icon name="Plus" size={14} strokeWidth={2} />
                <span>Save Current Filters</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;