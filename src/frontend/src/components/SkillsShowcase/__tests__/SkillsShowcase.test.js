import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SkillsShowcase from '../SkillsShowcase';

// Mock the useDataFetching hook
jest.mock('../../../components/Utils/useDataFetching', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    data: [
      { id: 1, name: 'React', category: 'Frontend', level: 90 },
      { id: 2, name: 'TypeScript', category: 'Language', level: 85 },
      { id: 3, name: 'Node.js', category: 'Backend', level: 80 },
    ],
    loading: false,
    error: null,
    refetch: jest.fn(),
  })),
}));

describe('SkillsShowcase', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('renders the component with tabs', () => {
    render(<SkillsShowcase />);
    
    // Check that the title is rendered
    expect(screen.getByText('Skills Showcase')).toBeInTheDocument();
    
    // Check that all tabs are rendered
    expect(screen.getByText('React Hooks')).toBeInTheDocument();
    expect(screen.getByText('Context API')).toBeInTheDocument();
    expect(screen.getByText('Performance')).toBeInTheDocument();
    expect(screen.getByText('Code Splitting')).toBeInTheDocument();
  });

  test('changes tab content when tab is clicked', () => {
    render(<SkillsShowcase />);
    
    // Initially, the React Hooks tab should be active
    expect(screen.getByText(/useState and useEffect/i)).toBeInTheDocument();
    
    // Click on the Context API tab
    fireEvent.click(screen.getByText('Context API'));
    
    // Context API content should be visible
    expect(screen.getByText(/Centralized state management/i)).toBeInTheDocument();
    
    // Click on the Performance tab
    fireEvent.click(screen.getByText('Performance'));
    
    // Performance content should be visible
    expect(screen.getByText(/useMemo and useCallback/i)).toBeInTheDocument();
  });

  test('renders skill chart with correct data', () => {
    render(<SkillsShowcase />);
    
    // Click on the Code Splitting tab to show the skill chart
    fireEvent.click(screen.getByText('Code Splitting'));
    
    // Check that the skill chart title is rendered
    expect(screen.getByText('Skill Proficiency Chart')).toBeInTheDocument();
    
    // Check that the skills from the mock data are rendered
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
  });

  test('filters skills by category', () => {
    render(<SkillsShowcase />);
    
    // Click on the Code Splitting tab to show the skill chart
    fireEvent.click(screen.getByText('Code Splitting'));
    
    // Initially, all skills should be visible
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
    
    // Select the Frontend category
    fireEvent.mouseDown(screen.getByLabelText('Filter by Category'));
    fireEvent.click(screen.getByText('Frontend'));
    
    // Only Frontend skills should be visible
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.queryByText('TypeScript')).not.toBeInTheDocument();
    expect(screen.queryByText('Node.js')).not.toBeInTheDocument();
  });

  test('shows loading state when data is loading', () => {
    // Override the mock to return loading state
    require('../../../components/Utils/useDataFetching').default.mockReturnValueOnce({
      data: [],
      loading: true,
      error: null,
      refetch: jest.fn(),
    });
    
    render(<SkillsShowcase />);
    
    // Click on the Code Splitting tab to show the skill chart
    fireEvent.click(screen.getByText('Code Splitting'));
    
    // Check that loading indicator is shown
    expect(screen.getByTestId('skills-loading')).toBeInTheDocument();
  });

  test('shows error state when there is an error', () => {
    // Override the mock to return error state
    require('../../../components/Utils/useDataFetching').default.mockReturnValueOnce({
      data: [],
      loading: false,
      error: 'Failed to load skills data',
      refetch: jest.fn(),
    });
    
    render(<SkillsShowcase />);
    
    // Click on the Code Splitting tab to show the skill chart
    fireEvent.click(screen.getByText('Code Splitting'));
    
    // Check that error message is shown
    expect(screen.getByText('Failed to load skills data')).toBeInTheDocument();
  });

  test('calls refetch when retry button is clicked', () => {
    // Create a mock refetch function
    const mockRefetch = jest.fn();
    
    // Override the mock to return error state with the mock refetch function
    require('../../../components/Utils/useDataFetching').default.mockReturnValueOnce({
      data: [],
      loading: false,
      error: 'Failed to load skills data',
      refetch: mockRefetch,
    });
    
    render(<SkillsShowcase />);
    
    // Click on the Code Splitting tab to show the skill chart
    fireEvent.click(screen.getByText('Code Splitting'));
    
    // Click the retry button
    fireEvent.click(screen.getByText('Retry'));
    
    // Check that refetch was called
    expect(mockRefetch).toHaveBeenCalled();
  });
}); 