import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorBoundary from '../ErrorBoundary';
import { NotificationContext } from '../../../contexts/NotificationContext';

// Mock component that will throw an error
const ErrorComponent = () => {
  throw new Error('Test error');
};

// Mock component that doesn't throw an error
const NormalComponent = () => <div>Normal component</div>;

// Mock notification context
const mockShowNotification = jest.fn();
const mockNotificationContext = {
  showNotification: mockShowNotification,
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Suppress console.error for cleaner test output
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console.error after each test
    console.error.mockRestore();
  });

  test('renders children when there is no error', () => {
    render(
      <NotificationContext.Provider value={mockNotificationContext}>
        <ErrorBoundary>
          <NormalComponent />
        </ErrorBoundary>
      </NotificationContext.Provider>
    );

    expect(screen.getByText('Normal component')).toBeInTheDocument();
    expect(mockShowNotification).not.toHaveBeenCalled();
  });

  test('renders fallback UI when there is an error', () => {
    // We need to suppress the React error boundary warning in the console
    const originalError = console.error;
    console.error = jest.fn();

    render(
      <NotificationContext.Provider value={mockNotificationContext}>
        <ErrorBoundary>
          <ErrorComponent />
        </ErrorBoundary>
      </NotificationContext.Provider>
    );

    // Check that the error message is displayed
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    
    // Check that the notification was shown
    expect(mockShowNotification).toHaveBeenCalledWith({
      message: 'An error occurred: Test error',
      type: 'error',
    });

    // Restore console.error
    console.error = originalError;
  });

  test('calls resetErrorBoundary when try again button is clicked', () => {
    // Mock resetErrorBoundary function
    const resetErrorBoundary = jest.fn();
    
    // We need to suppress the React error boundary warning in the console
    const originalError = console.error;
    console.error = jest.fn();

    // Render with a custom resetErrorBoundary prop
    render(
      <NotificationContext.Provider value={mockNotificationContext}>
        <ErrorBoundary resetErrorBoundary={resetErrorBoundary}>
          <ErrorComponent />
        </ErrorBoundary>
      </NotificationContext.Provider>
    );

    // Click the try again button
    const tryAgainButton = screen.getByText(/Try again/i);
    tryAgainButton.click();

    // Check that resetErrorBoundary was called
    expect(resetErrorBoundary).toHaveBeenCalled();

    // Restore console.error
    console.error = originalError;
  });
}); 