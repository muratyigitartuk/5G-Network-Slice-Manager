import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';
import { AuthProvider } from '../../Auth/AuthContext';

// Mock the translation hook
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, params) => {
      // Simple mock implementation that returns the key
      if (params) {
        return `${key} ${JSON.stringify(params)}`;
      }
      return key;
    }
  })
}));

describe('Dashboard Component', () => {
  test('renders dashboard with stats and activity sections', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Dashboard />
        </AuthProvider>
      </BrowserRouter>
    );
    
    // Check if key dashboard elements are rendered
    expect(screen.getByText('dashboard.componentStatus')).toBeInTheDocument();
    expect(screen.getByText('dashboard.recentActivities')).toBeInTheDocument();
    expect(screen.getByText('dashboard.quickActions')).toBeInTheDocument();
    
    // Verify quick stats are displayed
    expect(screen.getByText('dashboard.stats.activeSlices')).toBeInTheDocument();
    expect(screen.getByText('dashboard.stats.runningVnfs')).toBeInTheDocument();
    
    // Verify buttons for actions
    expect(screen.getByText('dashboard.actions.createSlice')).toBeInTheDocument();
    expect(screen.getByText('dashboard.actions.deployVNF')).toBeInTheDocument();
  });
}); 