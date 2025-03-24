import React from 'react';
import { Box, Typography, Button, Paper, Container } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { Block as BlockIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useAuth } from './AuthContext';
import { useTranslation } from 'react-i18next';

const UnauthorizedPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { currentUser } = useAuth();

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <BlockIcon color="error" sx={{ fontSize: 80, mb: 2 }} />
          
          <Typography variant="h4" color="error" gutterBottom>
            {t('auth.accessDenied')}
          </Typography>
          
          <Typography variant="body1" paragraph>
            {t('auth.noPermission')}
          </Typography>
          
          {currentUser && (
            <Typography variant="body2" color="text.secondary" paragraph>
              {t('auth.currentRole')}: <strong>{currentUser.role}</strong>
            </Typography>
          )}
          
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => history.goBack()}
            >
              {t('common.goBack')}
            </Button>
            
            <Button
              variant="contained"
              onClick={() => history.push('/dashboard')}
            >
              {t('navigation.goToDashboard')}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default UnauthorizedPage; 