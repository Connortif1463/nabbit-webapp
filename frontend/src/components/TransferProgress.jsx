import React from 'react';
import {
  Box,
  Paper,
  Typography,
  LinearProgress,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Chip
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import MergeIcon from '@mui/icons-material/Merge';
import LoopIcon from '@mui/icons-material/Loop';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

const TransferProgress = ({ 
  transferStatus, 
  progress, 
  transferResults,
  onComplete,
  onBack 
}) => {
  if (transferStatus === 'transferring') {
    const percent = (progress.current / progress.total) * 100;
    
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Box sx={{ mb: 3 }}>
            <LoopIcon sx={{ fontSize: 48, color: 'primary.main', animation: 'spin 2s linear infinite' }} />
          </Box>
          <Typography variant="h5" gutterBottom>
            Transferring Playlists...
          </Typography>
          
          <Box sx={{ my: 4 }}>
            <LinearProgress 
              variant="determinate" 
              value={percent} 
              sx={{ height: 10, borderRadius: 5 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {progress.message}
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              {progress.current} of {progress.total} playlists complete
            </Typography>
          </Box>

          <Button variant="outlined" onClick={onBack}>
            Cancel
          </Button>
        </Paper>
      </Box>
    );
  }

  if (transferStatus === 'complete' && transferResults) {
    const { results } = transferResults;
    
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom align="center">
            Transfer Complete! 🎉
          </Typography>

          <List sx={{ mb: 3 }}>
            {results?.successful?.length > 0 && (
              <>
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, color: 'success.main' }}>
                  ✅ New Playlists:
                </Typography>
                {results.successful.map(name => (
                  <ListItem key={name} dense>
                    <ListItemIcon><CheckCircleIcon color="success" fontSize="small" /></ListItemIcon>
                    <ListItemText primary={name} />
                  </ListItem>
                ))}
              </>
            )}

            {results?.merged?.length > 0 && (
              <>
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, color: 'info.main' }}>
                  🔄 Updated Playlists:
                </Typography>
                {results.merged.map(name => (
                  <ListItem key={name} dense>
                    <ListItemIcon><MergeIcon color="info" fontSize="small" /></ListItemIcon>
                    <ListItemText primary={name} />
                  </ListItem>
                ))}
              </>
            )}

            {results?.skipped?.length > 0 && (
              <>
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, color: 'text.secondary' }}>
                  ⏭️ Skipped (no changes):
                </Typography>
                {results.skipped.map(name => (
                  <ListItem key={name} dense>
                    <ListItemIcon><SkipNextIcon color="disabled" fontSize="small" /></ListItemIcon>
                    <ListItemText primary={name} />
                  </ListItem>
                ))}
              </>
            )}

            {results?.failed?.length > 0 && (
              <>
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, color: 'error.main' }}>
                  ❌ Failed:
                </Typography>
                {results.failed.map(name => (
                  <ListItem key={name} dense>
                    <ListItemIcon><ErrorIcon color="error" fontSize="small" /></ListItemIcon>
                    <ListItemText primary={name} />
                  </ListItem>
                ))}
              </>
            )}
          </List>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button variant="outlined" onClick={onBack}>
              Back to Selection
            </Button>
            <Button variant="contained" onClick={onComplete}>
              Done
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  return null;
};

export default TransferProgress;