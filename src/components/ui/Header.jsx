import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    {
      label: 'Live Monitoring',
      path: '/real-time-signal-monitoring-dashboard',
      icon: 'Activity',
      description: 'Real-time session oversight and clinical intervention'
    },
    {
      label: 'Patient Analytics',
      path: '/patient-progress-analytics-dashboard',
      icon: 'TrendingUp',
      description: 'Individual patient progress tracking and analysis'
    },
    {
      label: 'Session Management',
      path: '/therapy-session-management-dashboard',
      icon: 'Calendar',
      description: 'Administrative oversight and workflow optimization'
    },
    {
      label: 'Research Analytics',
      path: '/clinical-research-analytics-dashboard',
      icon: 'BarChart3',
      description: 'Population-level analysis and research capabilities'
    }
  ];

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-navigation bg-surface border-b border-border">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 clinical-transition hover:opacity-80">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Brain" size={20} color="#0F172A" strokeWidth={2.5} />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-heading-semibold text-text-primary">
                NeuroFlow
              </h1>
              <p className="text-xs text-text-secondary font-caption-normal">
                Clinical Analytics
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`group relative px-4 py-2 rounded-lg clinical-transition ${
                  isActiveRoute(item.path)
                    ? 'bg-primary/10 text-primary' :'text-text-secondary hover:text-text-primary hover:bg-surface-700'
                }`}
                title={item.description}
              >
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={item.icon} 
                    size={16} 
                    strokeWidth={2}
                    className={isActiveRoute(item.path) ? 'text-primary' : 'text-current'}
                  />
                  <span className="font-body-medium text-sm">
                    {item.label}
                  </span>
                </div>
                {isActiveRoute(item.path) && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Session Status & User Panel */}
          <div className="flex items-center space-x-4">
            {/* Session Status Indicator */}
            <div className="hidden md:flex items-center space-x-2 px-3 py-2 bg-surface-700 rounded-lg border border-border">
              <div className="w-2 h-2 bg-success rounded-full pulse-alert" />
              <span className="text-xs font-data-normal text-text-secondary">
                3 Active
              </span>
            </div>

            {/* User Context Panel */}
            <div className="flex items-center space-x-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-body-medium text-text-primary">
                  Dr. Sarah Chen
                </p>
                <p className="text-xs text-text-secondary">
                  Neurologist
                </p>
              </div>
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="#F8FAFC" strokeWidth={2} />
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 rounded-lg clinical-transition hover:bg-surface-700 text-text-secondary hover:text-text-primary"
              aria-label="Toggle navigation menu"
            >
              <Icon name={isMenuOpen ? 'X' : 'Menu'} size={20} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-border">
            <nav className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg clinical-transition ${
                    isActiveRoute(item.path)
                      ? 'bg-primary/10 text-primary border border-primary/20' :'text-text-secondary hover:text-text-primary hover:bg-surface-700'
                  }`}
                >
                  <Icon 
                    name={item.icon} 
                    size={18} 
                    strokeWidth={2}
                    className={isActiveRoute(item.path) ? 'text-primary' : 'text-current'}
                  />
                  <div className="flex-1">
                    <p className="font-body-medium text-sm">
                      {item.label}
                    </p>
                    <p className="text-xs text-text-tertiary mt-0.5">
                      {item.description}
                    </p>
                  </div>
                  {isActiveRoute(item.path) && (
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Mobile Session Status */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between px-4 py-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full pulse-alert" />
                  <span className="text-sm font-body-medium text-text-primary">
                    Active Sessions
                  </span>
                </div>
                <span className="text-sm font-data-normal text-primary">
                  3
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;