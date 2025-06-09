import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import Header from "components/ui/Header";
import NotFound from "pages/NotFound";
import RealTimeSignalMonitoringDashboard from "pages/real-time-signal-monitoring-dashboard";
import PatientProgressAnalyticsDashboard from "pages/patient-progress-analytics-dashboard";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <div className="min-h-screen bg-background">
          <Header />
          <main className="pt-20">
            <RouterRoutes>
              <Route path="/" element={<RealTimeSignalMonitoringDashboard />} />
              <Route path="/real-time-signal-monitoring-dashboard" element={<RealTimeSignalMonitoringDashboard />} />
              <Route path="/patient-progress-analytics-dashboard" element={<PatientProgressAnalyticsDashboard />} />
              <Route path="*" element={<NotFound />} />
            </RouterRoutes>
          </main>
        </div>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;