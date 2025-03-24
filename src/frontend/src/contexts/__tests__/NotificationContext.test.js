import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NotificationProvider, useNotification } from '../NotificationContext';

// Test component that uses the notification context
const TestComponent = () => {
  const { showNotification, notifications, closeNotification } = useNotification();
  
  return (
    <div>
      <button 
        onClick={() => showNotification({ message: 'Test notification', type: 'info' })}
        data-testid="show-info"
      >
        Show Info
      </button>
      <button 
        onClick={() => showNotification({ message: 'Error notification', type: 'error' })}
        data-testid="show-error"
      >
        Show Error
      </button>
      <button 
        onClick={() => showNotification({ message: 'Success notification', type: 'success' })}
        data-testid="show-success"
      >
        Show Success
      </button>
      <button 
        onClick={() => showNotification({ message: 'Warning notification', type: 'warning' })}
        data-testid="show-warning"
      >
        Show Warning
      </button>
      <div data-testid="notifications-count">{notifications.length}</div>
      {notifications.map((notification) => (
        <div key={notification.id} data-testid={`notification-${notification.id}`}>
          <span data-testid={`message-${notification.id}`}>{notification.message}</span>
          <span data-testid={`type-${notification.id}`}>{notification.type}</span>
          <button 
            onClick={() => closeNotification(notification.id)}
            data-testid={`close-${notification.id}`}
          >
            Close
          </button>
        </div>
      ))}
    </div>
  );
};

describe('NotificationContext', () => {
  beforeEach(() => {
    // Clear all timers before each test
    jest.useFakeTimers();
  });

  afterEach(() => {
    // Restore timers after each test
    jest.useRealTimers();
  });

  test('provides notification context to children', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );
    
    // Check that the component rendered
    expect(screen.getByTestId('show-info')).toBeInTheDocument();
    expect(screen.getByTestId('notifications-count')).toHaveTextContent('0');
  });

  test('shows a notification when showNotification is called', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );
    
    // Initially, there should be no notifications
    expect(screen.getByTestId('notifications-count')).toHaveTextContent('0');
    
    // Show a notification
    act(() => {
      screen.getByTestId('show-info').click();
    });
    
    // There should now be one notification
    expect(screen.getByTestId('notifications-count')).toHaveTextContent('1');
    
    // Check the notification content
    expect(screen.getByTestId(`message-0`)).toHaveTextContent('Test notification');
    expect(screen.getByTestId(`type-0`)).toHaveTextContent('info');
  });

  test('closes a notification when closeNotification is called', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );
    
    // Show a notification
    act(() => {
      screen.getByTestId('show-info').click();
    });
    
    // There should now be one notification
    expect(screen.getByTestId('notifications-count')).toHaveTextContent('1');
    
    // Close the notification
    act(() => {
      screen.getByTestId('close-0').click();
    });
    
    // There should now be no notifications
    expect(screen.getByTestId('notifications-count')).toHaveTextContent('0');
  });

  test('automatically closes notifications after the specified duration', async () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );
    
    // Show a notification
    act(() => {
      screen.getByTestId('show-info').click();
    });
    
    // There should now be one notification
    expect(screen.getByTestId('notifications-count')).toHaveTextContent('1');
    
    // Fast-forward time by the default duration (5000ms)
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    
    // There should now be no notifications
    expect(screen.getByTestId('notifications-count')).toHaveTextContent('0');
  });

  test('shows different types of notifications', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );
    
    // Show an error notification
    act(() => {
      screen.getByTestId('show-error').click();
    });
    
    // Check the notification type
    expect(screen.getByTestId('type-0')).toHaveTextContent('error');
    
    // Close the notification
    act(() => {
      screen.getByTestId('close-0').click();
    });
    
    // Show a success notification
    act(() => {
      screen.getByTestId('show-success').click();
    });
    
    // Check the notification type
    expect(screen.getByTestId('type-0')).toHaveTextContent('success');
    
    // Close the notification
    act(() => {
      screen.getByTestId('close-0').click();
    });
    
    // Show a warning notification
    act(() => {
      screen.getByTestId('show-warning').click();
    });
    
    // Check the notification type
    expect(screen.getByTestId('type-0')).toHaveTextContent('warning');
  });

  test('handles multiple notifications correctly', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );
    
    // Show multiple notifications
    act(() => {
      screen.getByTestId('show-info').click();
      screen.getByTestId('show-error').click();
      screen.getByTestId('show-success').click();
    });
    
    // There should now be three notifications
    expect(screen.getByTestId('notifications-count')).toHaveTextContent('3');
    
    // Check the notification types
    expect(screen.getByTestId('type-0')).toHaveTextContent('info');
    expect(screen.getByTestId('type-1')).toHaveTextContent('error');
    expect(screen.getByTestId('type-2')).toHaveTextContent('success');
    
    // Close the second notification
    act(() => {
      screen.getByTestId('close-1').click();
    });
    
    // There should now be two notifications
    expect(screen.getByTestId('notifications-count')).toHaveTextContent('2');
    
    // The remaining notifications should be the first and third
    expect(screen.getByTestId('type-0')).toHaveTextContent('info');
    expect(screen.getByTestId('type-2')).toHaveTextContent('success');
  });
}); 