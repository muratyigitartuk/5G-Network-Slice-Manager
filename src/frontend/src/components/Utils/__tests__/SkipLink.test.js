import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SkipLink from '../SkipLink';

describe('SkipLink', () => {
  // Mock scrollIntoView function
  const mockScrollIntoView = jest.fn();
  
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Mock getElementById and scrollIntoView
    document.getElementById = jest.fn().mockImplementation(() => ({
      scrollIntoView: mockScrollIntoView,
      focus: jest.fn(),
    }));
  });

  test('renders skip link with correct text', () => {
    render(<SkipLink targetId="main-content" />);
    
    const skipLink = screen.getByText('Skip to main content');
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  test('renders skip link with custom text when provided', () => {
    render(<SkipLink targetId="main-content" text="Skip to content" />);
    
    const skipLink = screen.getByText('Skip to content');
    expect(skipLink).toBeInTheDocument();
  });

  test('scrolls to target element when clicked', () => {
    render(<SkipLink targetId="main-content" />);
    
    const skipLink = screen.getByText('Skip to main content');
    fireEvent.click(skipLink);
    
    expect(document.getElementById).toHaveBeenCalledWith('main-content');
    expect(mockScrollIntoView).toHaveBeenCalled();
  });

  test('applies focus to target element when clicked', () => {
    const mockFocus = jest.fn();
    document.getElementById = jest.fn().mockImplementation(() => ({
      scrollIntoView: mockScrollIntoView,
      focus: mockFocus,
    }));

    render(<SkipLink targetId="main-content" />);
    
    const skipLink = screen.getByText('Skip to main content');
    fireEvent.click(skipLink);
    
    expect(mockFocus).toHaveBeenCalled();
  });

  test('handles case when target element is not found', () => {
    // Mock getElementById to return null
    document.getElementById = jest.fn().mockReturnValue(null);
    
    // Mock console.error to avoid polluting test output
    const originalError = console.error;
    console.error = jest.fn();
    
    render(<SkipLink targetId="non-existent-id" />);
    
    const skipLink = screen.getByText('Skip to main content');
    fireEvent.click(skipLink);
    
    expect(document.getElementById).toHaveBeenCalledWith('non-existent-id');
    expect(console.error).toHaveBeenCalledWith(
      'Target element with ID "non-existent-id" not found'
    );
    
    // Restore console.error
    console.error = originalError;
  });

  test('has correct styling for visibility', () => {
    render(<SkipLink targetId="main-content" />);
    
    const skipLink = screen.getByText('Skip to main content');
    
    // Check initial styling (should be visually hidden but accessible)
    expect(skipLink).toHaveStyle({
      position: 'absolute',
      left: '-999px',
      width: '1px',
      height: '1px',
      overflow: 'hidden',
    });
    
    // Simulate focus
    fireEvent.focus(skipLink);
    
    // Check styling when focused (should be visible)
    expect(skipLink).toHaveStyle({
      position: 'fixed',
      left: '10px',
      top: '10px',
      width: 'auto',
      height: 'auto',
      overflow: 'visible',
    });
  });
}); 