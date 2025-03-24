import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CardWithLoading from '../CardWithLoading';

describe('CardWithLoading', () => {
  // Test rendering with title
  test('renders with title', () => {
    render(<CardWithLoading title="Test Card" />);
    expect(screen.getByText('Test Card')).toBeInTheDocument();
  });
  
  // Test loading state
  test('displays loading skeleton when loading', () => {
    const { container } = render(
      <CardWithLoading 
        title="Loading Card" 
        loading={true} 
      />
    );
    
    // Check for skeleton elements
    expect(container.querySelectorAll('.MuiSkeleton-root')).toHaveLength(3);
  });
  
  // Test error state
  test('displays error message when error is provided', () => {
    const errorMessage = 'Something went wrong';
    render(
      <CardWithLoading 
        title="Error Card" 
        error={errorMessage} 
      />
    );
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
  
  // Test retry button in error state
  test('calls onRetry when retry button is clicked', () => {
    const onRetry = jest.fn();
    render(
      <CardWithLoading 
        title="Error Card" 
        error="Error message" 
        onRetry={onRetry}
      />
    );
    
    const retryButton = screen.getByRole('button');
    userEvent.click(retryButton);
    
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
  
  // Test empty state
  test('displays empty message when isEmpty is true', () => {
    const emptyMessage = 'No data available';
    render(
      <CardWithLoading 
        title="Empty Card" 
        isEmpty={true} 
        emptyMessage={emptyMessage}
      />
    );
    
    expect(screen.getByText(emptyMessage)).toBeInTheDocument();
  });
  
  // Test content rendering
  test('renders children when not loading, no error, and not empty', () => {
    const childContent = 'Card content';
    render(
      <CardWithLoading title="Content Card">
        <div>{childContent}</div>
      </CardWithLoading>
    );
    
    expect(screen.getByText(childContent)).toBeInTheDocument();
  });
  
  // Test collapsible functionality
  test('collapses and expands when collapsible', () => {
    const childContent = 'Collapsible content';
    render(
      <CardWithLoading 
        title="Collapsible Card" 
        collapsible={true}
        defaultExpanded={true}
      >
        <div>{childContent}</div>
      </CardWithLoading>
    );
    
    // Content should be visible initially
    expect(screen.getByText(childContent)).toBeVisible();
    
    // Find and click the expand button
    const expandButton = screen.getByLabelText('show more');
    userEvent.click(expandButton);
    
    // Content should be hidden after clicking
    expect(screen.queryByText(childContent)).not.toBeVisible();
  });
  
  // Test footer actions
  test('renders footer actions when provided', () => {
    const footerText = 'Footer Action';
    render(
      <CardWithLoading 
        title="Card with Footer" 
        footerActions={<button>{footerText}</button>}
      >
        <div>Content</div>
      </CardWithLoading>
    );
    
    expect(screen.getByText(footerText)).toBeInTheDocument();
  });
}); 