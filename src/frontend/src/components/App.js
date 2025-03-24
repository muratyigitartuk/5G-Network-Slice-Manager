import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';

// Layout components
import Sidebar from './Layout/Sidebar';
import Header from './Layout/Header';

// Page components
import Dashboard from './Dashboard/Dashboard';
import NetworkSlices from './NetworkSlices/NetworkSlices';
import QosMonitoring from './QosMonitoring/QosMonitoring';
import VnfManagement from './VnfManagement/VnfManagement';
import ServiceChaining from './ServiceChaining/ServiceChaining';
import ResourceOrchestrator from './ResourceOrchestration/ResourceOrchestrator';
import MonitoringDashboard from './MonitoringAnalytics/MonitoringDashboard';
import DetailedAnalytics from './Analytics/DetailedAnalytics';
import ComplianceManagement from './Compliance/ComplianceManagement';
import Settings from './Settings/Settings';
import UserProfile from './UserManagement/UserProfile';
import LoginPage from './Auth/LoginPage';
import { AuthProvider, useAuth } from './Auth/AuthContext';
import { ThemeModeProvider } from './Theme/ThemeProvider';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

const AppContent = () => {
  const { currentUser } = useAuth();
  
  return (
    <Router>
      {currentUser ? (
        <Box sx={{ display: 'flex' }}>
          <Sidebar />
          <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
            <Header />
            <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/network-slices" element={<NetworkSlices />} />
                <Route path="/qos-monitoring" element={<QosMonitoring />} />
                <Route path="/vnf-management" element={<VnfManagement />} />
                <Route path="/service-chaining" element={<ServiceChaining />} />
                <Route path="/resource-orchestration" element={<ResourceOrchestrator />} />
                <Route path="/monitoring-dashboard" element={<MonitoringDashboard />} />
                <Route path="/detailed-analytics" element={<DetailedAnalytics />} />
                <Route path="/compliance" element={<ComplianceManagement />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Box>
          </Box>
        </Box>
      ) : (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </Router>
  );
};

const App = () => {
  return (
    <ThemeModeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeModeProvider>
  );
};

export default App; 