import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Divider,
  Alert,
  Snackbar,
  IconButton,
  Paper,
  Chip
} from '@mui/material';
import {
  Person as PersonIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Email as EmailIcon,
  Work as WorkIcon,
  Badge as BadgeIcon,
  PhotoCamera as PhotoCameraIcon
} from '@mui/icons-material';
import { useAuth } from '../Auth/AuthContext';
import { useTranslation } from 'react-i18next';

const UserProfile = () => {
  const { t } = useTranslation();
  const { currentUser, updateProfile } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    role: '',
    bio: '',
    jobTitle: '',
    department: '',
    skills: []
  });
  const [editMode, setEditMode] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    if (currentUser) {
      // Initialize with current user data
      setProfile({
        name: currentUser.name || '',
        email: currentUser.email || '',
        role: currentUser.role || '',
        bio: currentUser.bio || t('profile.defaultBio'),
        jobTitle: currentUser.jobTitle || t('profile.defaultJobTitle'),
        department: currentUser.department || t('profile.defaultDepartment'),
        skills: currentUser.skills || [t('profile.skill.sdn'), t('profile.skill.nfv'), t('profile.skill.networkSlicing'), t('profile.skill.5g')]
      });
    }
  }, [currentUser, t]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddSkill();
    }
  };

  const handleSave = () => {
    try {
      // In a real app, this would call an API
      // For now, we'll just update the local state
      if (typeof updateProfile === 'function') {
        updateProfile(profile);
      }
      setSuccess(true);
      setEditMode(false);
      setError('');
    } catch (err) {
      setError(t('profile.updateError'));
    }
  };

  const handleCancel = () => {
    // Reset to original values
    if (currentUser) {
      setProfile({
        name: currentUser.name || '',
        email: currentUser.email || '',
        role: currentUser.role || '',
        bio: currentUser.bio || t('profile.defaultBio'),
        jobTitle: currentUser.jobTitle || t('profile.defaultJobTitle'),
        department: currentUser.department || t('profile.defaultDepartment'),
        skills: currentUser.skills || [t('profile.skill.sdn'), t('profile.skill.nfv'), t('profile.skill.networkSlicing'), t('profile.skill.5g')]
      });
    }
    setEditMode(false);
  };

  const handleCloseSnackbar = () => {
    setSuccess(false);
  };

  if (!currentUser) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>{t('profile.loginRequired')}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        {t('profile.title')}
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        {t('profile.subtitle')}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Header */}
        <Grid item xs={12}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' }, 
              alignItems: { xs: 'center', sm: 'flex-start' },
              gap: 3
            }}
          >
            <Box sx={{ position: 'relative' }}>
              <Avatar 
                sx={{ 
                  width: 100, 
                  height: 100, 
                  bgcolor: currentUser.role === 'admin' ? 'error.main' : 'primary.main',
                  fontSize: '2rem'
                }}
              >
                {profile.name.charAt(0)}
              </Avatar>
              {editMode && (
                <IconButton 
                  sx={{ 
                    position: 'absolute', 
                    bottom: 0, 
                    right: 0, 
                    bgcolor: 'background.paper' 
                  }}
                  size="small"
                >
                  <PhotoCameraIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
            
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h5">
                  {profile.name}
                </Typography>
                {!editMode ? (
                  <Button 
                    variant="outlined" 
                    startIcon={<EditIcon />}
                    onClick={() => setEditMode(true)}
                    size="small"
                  >
                    {t('profile.editProfile')}
                  </Button>
                ) : (
                  <Box>
                    <Button 
                      variant="outlined" 
                      startIcon={<CancelIcon />}
                      onClick={handleCancel}
                      size="small"
                      sx={{ mr: 1 }}
                      color="error"
                    >
                      {t('common.cancel')}
                    </Button>
                    <Button 
                      variant="contained" 
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                      size="small"
                    >
                      {t('common.save')}
                    </Button>
                  </Box>
                )}
              </Box>
              
              <Typography variant="body1" color="text.secondary">
                {profile.jobTitle} • {profile.department}
              </Typography>
              
              <Chip 
                label={profile.role.toUpperCase()} 
                color={profile.role === 'admin' ? 'error' : 'primary'} 
                size="small" 
                sx={{ mt: 1 }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Personal Information */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <PersonIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">{t('profile.personalInfo')}</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              {editMode ? (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t('common.name')}
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t('profile.email')}
                      name="email"
                      value={profile.email}
                      onChange={handleChange}
                      type="email"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t('profile.jobTitle')}
                      name="jobTitle"
                      value={profile.jobTitle}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t('profile.department')}
                      name="department"
                      value={profile.department}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
              ) : (
                <Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Box display="flex" alignItems="center" mb={1}>
                        <EmailIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {t('profile.email')}:
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ ml: 4 }}>
                        {profile.email}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Box display="flex" alignItems="center" mb={1}>
                        <WorkIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {t('profile.jobTitle')}:
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ ml: 4 }}>
                        {profile.jobTitle}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Box display="flex" alignItems="center" mb={1}>
                        <BadgeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {t('profile.department')}:
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ ml: 4 }}>
                        {profile.department}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Bio and Skills */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <PersonIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Bio & Skills</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Bio
              </Typography>
              
              {editMode ? (
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  variant="outlined"
                  size="small"
                  sx={{ mb: 3 }}
                />
              ) : (
                <Typography variant="body1" paragraph>
                  {profile.bio}
                </Typography>
              )}
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Skills
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: editMode ? 2 : 0 }}>
                {profile.skills.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    onDelete={editMode ? () => handleRemoveSkill(skill) : undefined}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Box>
              
              {editMode && (
                <Box sx={{ display: 'flex', mt: 2 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Add Skill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <Button 
                    variant="contained" 
                    onClick={handleAddSkill}
                    sx={{ ml: 1 }}
                  >
                    Add
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          {t('profile.updateSuccess')}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserProfile; 