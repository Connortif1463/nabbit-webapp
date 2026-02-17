import React, { useEffect, useState } from 'react';
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

const TransferProgress = ({ 
  transferStatus, 
  progress, 
  transferResults,
  onComplete,
  onBack 
}) => {
  const [results, setResults] = useState(null);

  useEffect(() => {
    if (transferResults) {
      setResults(transferResults);
    }
  }, [transferResults]);

  if (transferStatus === 'transferring') {
    const percent = (progress.current / progress.total) * 100;
    
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
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
              {progress.current} of {progress.total} complete
            </Typography>
          </Box>
        </Paper>
      </Box>
    );
  }

  if (transferStatus === 'complete' && results) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom align="center">
            Transfer Complete! 🎉
          </Typography>

          <List sx={{ mb: 3 }}>
            {results.successful.length > 0 && (
              <>
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>✅ New Playlists:</Typography>
                {results.successful.map(name => (
                  <ListItem key={name}>
                    <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                    <ListItemText primary={name} />
                  </ListItem>
                ))}
              </>
            )}

            {results.merged.length > 0 && (
              <>
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>🔄 Updated Playlists:</Typography>
                {results.merged.map(name => (
                  <ListItem key={name}>
                    <ListItemIcon><MergeIcon color="info" /></ListItemIcon>
                    <ListItemText primary={name} />
                  </ListItem>
                ))}
              </>
            )}

            {results.skipped.length > 0 && (
              <>
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>⏭️ Skipped (no changes):</Typography>
                {results.skipped.map(name => (
                  <ListItem key={name}>
                    <ListItemIcon><SkipNextIcon color="disabled" /></ListItemIcon>
                    <ListItemText primary={name} />
                  </ListItem>
                ))}
              </>
            )}

            {results.failed.length > 0 && (
              <>
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>❌ Failed:</Typography>
                {results.failed.map(name => (
                  <ListItem key={name}>
                    <ListItemIcon><ErrorIcon color="error" /></ListItemIcon>
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