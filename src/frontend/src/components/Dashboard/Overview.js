import React from 'react';
import { Box, Typography, Divider, Paper, Grid } from '@mui/material';
import { useAuth } from '../Auth/AuthContext';

const Overview = () => {
  const { currentUser } = useAuth();

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {currentUser ? currentUser.name : 'User'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Network Slicing Management Platform
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 4 }} />
      
      {/* Simple hardcoded dashboard content */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 240 }}>
            <Typography variant="h6" gutterBottom>
              Network Slices
            </Typography>
            <Typography variant="h3" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              5
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active network slices
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 240 }}>
            <Typography variant="h6" gutterBottom>
              VNF Instances
            </Typography>
            <Typography variant="h3" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              12
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active VNF instances
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 240 }}>
            <Typography variant="h6" gutterBottom>
              Service Chains
            </Typography>
            <Typography variant="h3" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              3
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active service chains
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Overview; 