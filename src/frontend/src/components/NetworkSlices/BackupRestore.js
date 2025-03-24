import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip
} from '@mui/material';
import {
  Backup as BackupIcon,
  Restore as RestoreIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import axios from 'axios';

const BackupRestore = ({ slice, onBackupComplete }) => {
  const [backups, setBackups] = useState([
    // Sample backup data (in real app, this would come from API)
    {
      id: '1',
      name: 'Auto Backup',
      timestamp: '2025-03-12T14:00:00Z',
      type: 'auto',
      size: '2.5MB'
    },
    {
      id: '2',
      name: 'Pre-Update Backup',
      timestamp: '2025-03-11T10:30:00Z',
      type: 'manual',
      size: '2.3MB'
    }
  ]);
  const [openDialog, setOpenDialog] = useState(false);
  const [backupName, setBackupName] = useState('');

  const handleCreateBackup = async () => {
    try {
      // In real app, this would be an API call
      const newBackup = {
        id: Date.now().toString(),
        name: backupName || `Backup ${new Date().toLocaleString()}`,
        timestamp: new Date().toISOString(),
        type: 'manual',
        size: '2.4MB'
      };
      
      setBackups([newBackup, ...backups]);
      setOpenDialog(false);
      setBackupName('');
      onBackupComplete?.();
    } catch (error) {
      console.error('Failed to create backup:', error);
    }
  };

  const handleRestore = async (backupId) => {
    try {
      // In real app, this would be an API call
      console.log('Restoring from backup:', backupId);
      onBackupComplete?.();
    } catch (error) {
      console.error('Failed to restore backup:', error);
    }
  };

  const handleDelete = async (backupId) => {
    try {
      // In real app, this would be an API call
      setBackups(backups.filter(b => b.id !== backupId));
    } catch (error) {
      console.error('Failed to delete backup:', error);
    }
  };

  const handleDownload = async (backupId) => {
    try {
      // In real app, this would trigger a file download
      console.log('Downloading backup:', backupId);
    } catch (error) {
      console.error('Failed to download backup:', error);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Backup & Recovery</Typography>
        <Button
          variant="contained"
          startIcon={<BackupIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Create Backup
        </Button>
      </Box>

      <Paper>
        <List>
          {backups.map((backup) => (
            <ListItem key={backup.id}>
              <ListItemText
                primary={backup.name}
                secondary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>{new Date(backup.timestamp).toLocaleString()}</span>
                    <Chip
                      label={backup.type}
                      size="small"
                      color={backup.type === 'auto' ? 'primary' : 'secondary'}
                    />
                    <span>{backup.size}</span>
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={() => handleRestore(backup.id)}
                  title="Restore"
                >
                  <RestoreIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  onClick={() => handleDownload(backup.id)}
                  title="Download"
                >
                  <DownloadIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  onClick={() => handleDelete(backup.id)}
                  title="Delete"
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Create New Backup</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Backup Name"
            fullWidth
            value={backupName}
            onChange={(e) => setBackupName(e.target.value)}
            placeholder="Enter backup name (optional)"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateBackup} variant="contained" color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BackupRestore; 