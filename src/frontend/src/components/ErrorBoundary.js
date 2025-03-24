import React from 'react';
import { Box, Typography, Button, Paper, Divider } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Home as HomeIcon } from '@mui/icons-material';
import { useHistory } from 'react-router-dom';
import { useNotifications } from './Notifications/NotificationContext';
import PropTypes from 'prop-types';

/**
 * Error Boundary component to catch JavaScript errors anywhere in the child component tree
 * and display a fallback UI instead of crashing the whole app
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      componentStack: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    this.setState({
      errorInfo,
      componentStack: errorInfo.componentStack
    });
    
    // Notify the user about the error
    if (this.props.notifyError) {
      this.props.notifyError(error.message);
    }
  }

  resetErrorBoundary = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      componentStack: null
    });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback 
        error={this.state.error}
        componentStack={this.state.componentStack}
        resetErrorBoundary={this.resetErrorBoundary}
      />;
    }

    return this.props.children;
  }
}

/**
 * Error Fallback UI component
 */
const ErrorFallback = ({ error, componentStack, resetErrorBoundary }) => {
  const history = useHistory();
  
  const goToHome = () => {
    resetErrorBoundary();
    history.push('/');
  };
  
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: (theme) => theme.palette.background.default,
      }}
    >
      <Typography variant="h1" component="h1" gutterBottom>
        Oops!
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        Something went wrong.
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        {error.message}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={goToHome}
        startIcon={<HomeIcon />}
      >
        Back to Home
      </Button>
    </Box>
  );
};

/**
 * HOC to connect ErrorBoundary with NotificationContext
 */
const ErrorBoundaryWithNotification = (props) => {
  const { addNotification } = useNotifications();
  
  const notifyError = (message) => {
    addNotification({
      type: 'error',
      message: `Application Error: ${message}`
    });
  };
  
  return <ErrorBoundary {...props} notifyError={notifyError} />;
};

// Add PropTypes
ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  notifyError: PropTypes.bool
};

ErrorFallback.propTypes = {
  error: PropTypes.object,
  componentStack: PropTypes.string,
  resetErrorBoundary: PropTypes.func.isRequired
};

export default ErrorBoundaryWithNotification; 