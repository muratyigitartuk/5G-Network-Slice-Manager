import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Container,
  Grid,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import {
  LockOutlined as LockIcon,
  Person as PersonIcon,
  NetworkCheck as NetworkIcon
} from '@mui/icons-material';
import { useAuth } from './AuthContext';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const LoginPage = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  const { login, currentUser, error } = useAuth();
  const history = useHistory();
  const location = useLocation();
  
  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      const from = location.state?.from?.pathname || '/';
      history.replace(from);
    }
  }, [currentUser, history, location]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmitting(true);
    
    try {
      await login(username, password);
      const from = location.state?.from?.pathname || '/';
      history.replace(from);
    } catch (err) {
      setLoginError(err.message || t('auth.loginFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              height: '100%'
            }}
          >
            <Typography variant="h3" component="h1" gutterBottom color="primary">
              <NetworkIcon sx={{ fontSize: 40, mr: 1, verticalAlign: 'middle' }} />
              {t('auth.platformName')}
            </Typography>
            <Typography variant="h5" gutterBottom color="textSecondary">
              {t('auth.platformDescription')}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body1" paragraph>
              {t('auth.platformFeatures')}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Card sx={{ mb: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {t('auth.demoInfo')}
                  </Typography>
                  <Typography variant="body2">
                    {t('auth.demoDescription')}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {t('auth.availableRoles')}: admin, operator
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <LockIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography component="h1" variant="h5">
                {t('auth.signIn')}
              </Typography>
            </Box>
            
            {(loginError || error) && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {loginError || error}
              </Alert>
            )}
            
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label={t('auth.usernameLabel')}
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                InputProps={{
                  startAdornment: <PersonIcon color="action" sx={{ mr: 1 }} />
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label={t('auth.passwordLabel')}
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: <LockIcon color="action" sx={{ mr: 1 }} />
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? <CircularProgress size={24} /> : t('auth.signIn')}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LoginPage; 