import * as React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import MainLayout from './components/Layout/MainLayout';
import ErrorBoundary from './components/ErrorBoundary';
import Overview from './components/Dashboard/Overview';
import { AuthProvider } from './components/Auth/AuthContext';
import LoginPage from './components/Auth/LoginPage';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import UnauthorizedPage from './components/Auth/UnauthorizedPage';
import CustomThemeProvider from './components/Theme/ThemeProvider';
import { NotificationProvider } from './components/Notifications/NotificationContext';
import { useTranslation } from 'react-i18next';

// Lazy load other components
const NetworkSlices = React.lazy(() => import('./components/NetworkSlices/NetworkSlices'));
const VNFManagement = React.lazy(() => import('./components/VNF/VNFManagement'));
const ServiceChaining = React.lazy(() => import('./components/ServiceChaining/ServiceChaining'));
const QoSMonitoring = React.lazy(() => import('./components/QoSMonitoring/QoSMonitoring'));
const ResourceOrchestrator = React.lazy(() => import('./components/ResourceOrchestration/ResourceOrchestrator'));
const MonitoringDashboard = React.lazy(() => import('./components/MonitoringAnalytics/MonitoringDashboard'));
const Settings = React.lazy(() => import('./components/Settings/Settings'));

const LoadingFallback = () => {
  const { t } = useTranslation();
  return (
    <div style={{ padding: 20, textAlign: 'center' }}>{t('common.loading')}</div>
  );
};

function App() {
  return (
    <AuthProvider>
      <CustomThemeProvider>
        <NotificationProvider>
          <CssBaseline />
          <ErrorBoundary>
            <Switch>
              {/* Public routes */}
              <Route path="/login" component={LoginPage} />
              <Route path="/unauthorized" component={UnauthorizedPage} />
              
              {/* Protected routes */}
              <ProtectedRoute exact path="/">
                <MainLayout>
                  <React.Suspense fallback={<LoadingFallback />}>
                    <Overview />
                  </React.Suspense>
                </MainLayout>
              </ProtectedRoute>
              
              <ProtectedRoute path="/slices" requiredPermission="network:view">
                <MainLayout>
                  <React.Suspense fallback={<LoadingFallback />}>
                    <NetworkSlices />
                  </React.Suspense>
                </MainLayout>
              </ProtectedRoute>
              
              <ProtectedRoute path="/vnf" requiredPermission="vnf:view">
                <MainLayout>
                  <React.Suspense fallback={<LoadingFallback />}>
                    <VNFManagement />
                  </React.Suspense>
                </MainLayout>
              </ProtectedRoute>
              
              <ProtectedRoute path="/service-chaining" requiredPermission="service:view">
                <MainLayout>
                  <React.Suspense fallback={<LoadingFallback />}>
                    <ServiceChaining />
                  </React.Suspense>
                </MainLayout>
              </ProtectedRoute>
              
              <ProtectedRoute path="/qos-monitoring" requiredPermission="monitoring:view">
                <MainLayout>
                  <React.Suspense fallback={<LoadingFallback />}>
                    <QoSMonitoring />
                  </React.Suspense>
                </MainLayout>
              </ProtectedRoute>
              
              <ProtectedRoute path="/resource-orchestration" requiredPermission="resource:view">
                <MainLayout>
                  <React.Suspense fallback={<LoadingFallback />}>
                    <ResourceOrchestrator />
                  </React.Suspense>
                </MainLayout>
              </ProtectedRoute>
              
              <ProtectedRoute path="/monitoring-dashboard" requiredPermission="dashboard:view">
                <MainLayout>
                  <React.Suspense fallback={<LoadingFallback />}>
                    <MonitoringDashboard />
                  </React.Suspense>
                </MainLayout>
              </ProtectedRoute>
              
              <ProtectedRoute path="/settings" requiredPermission="settings:view">
                <MainLayout>
                  <React.Suspense fallback={<LoadingFallback />}>
                    <Settings />
                  </React.Suspense>
                </MainLayout>
              </ProtectedRoute>
              
              {/* Redirect any unknown routes to home */}
              <Route path="*">
                <Redirect to="/" />
              </Route>
            </Switch>
          </ErrorBoundary>
        </NotificationProvider>
      </CustomThemeProvider>
    </AuthProvider>
  );
}

export default App; 