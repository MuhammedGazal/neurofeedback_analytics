import React from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="AlertTriangle" size={48} className="text-warning" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl font-heading-bold text-text-primary mb-4">404</h1>
          <h2 className="text-xl font-heading-semibold text-text-primary mb-2">Page Not Found</h2>
          <p className="text-text-secondary font-body-normal">
            The clinical dashboard page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            to="/real-time-signal-monitoring-dashboard"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-primary text-background font-body-medium rounded-lg clinical-transition hover:bg-primary-600"
          >
            <Icon name="Activity" size={20} className="mr-2" strokeWidth={2} />
            Go to Live Monitoring
          </Link>
          
          <Link
            to="/"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-surface border border-border text-text-primary font-body-medium rounded-lg clinical-transition hover:bg-surface-700"
          >
            <Icon name="Home" size={20} className="mr-2" strokeWidth={2} />
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;