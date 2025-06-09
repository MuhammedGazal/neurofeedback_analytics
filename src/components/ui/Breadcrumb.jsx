import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Breadcrumb = () => {
  const location = useLocation();

  const routeLabels = {
    '/real-time-signal-monitoring-dashboard': 'Live Monitoring',
    '/patient-progress-analytics-dashboard': 'Patient Analytics',
    '/therapy-session-management-dashboard': 'Session Management',
    '/clinical-research-analytics-dashboard': 'Research Analytics'
  };

  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(segment => segment);
    const breadcrumbs = [
      { label: 'Dashboard', path: '/', isActive: false }
    ];

    if (pathSegments.length > 0) {
      const currentPath = `/${pathSegments.join('/')}`;
      const currentLabel = routeLabels[currentPath];
      
      if (currentLabel) {
        breadcrumbs.push({
          label: currentLabel,
          path: currentPath,
          isActive: true
        });
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm" aria-label="Breadcrumb">
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.path} className="flex items-center space-x-2">
          {index > 0 && (
            <Icon 
              name="ChevronRight" 
              size={14} 
              className="text-text-tertiary" 
              strokeWidth={2}
            />
          )}
          {crumb.isActive ? (
            <span className="font-body-medium text-text-primary">
              {crumb.label}
            </span>
          ) : (
            <Link
              to={crumb.path}
              className="font-body-normal text-text-secondary hover:text-text-primary clinical-transition"
            >
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;