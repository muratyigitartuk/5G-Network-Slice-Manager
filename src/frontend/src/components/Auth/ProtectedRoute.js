import React from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * A wrapper component that redirects to the login page if the user is not authenticated
 * or doesn't have the required permissions.
 */
const ProtectedRoute = ({ 
  children, 
  requiredPermission = null,
  redirectPath = '/login'
}) => {
  const { currentUser, loading, hasPermission } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100vh' 
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Checking authentication...
        </Typography>
      </Box>
    );
  }

  // If user is not logged in, redirect to login page
  if (!currentUser) {
    return <Redirect to={{
      pathname: "/login",
      state: { from: location }
    }} />;
  }

  // If a specific permission is required, check if user has it
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Redirect to={{
      pathname: "/unauthorized",
      state: { from: location }
    }} />;
  }

  // If user is authenticated and has required permissions, render the children
  return children;
};

// Add PropTypes validation
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredPermission: PropTypes.string,
  redirectPath: PropTypes.string
};

// Add default props
ProtectedRoute.defaultProps = {
  requiredPermission: '',
  redirectPath: '/login'
};

export default ProtectedRoute; 