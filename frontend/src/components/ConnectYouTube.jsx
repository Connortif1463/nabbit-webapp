import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Alert,
  CircularProgress
} from '@mui/material';
import YouTubeIcon from '@mui/icons-material/YouTube';

const ConnectYouTube = ({ 
  onNext, 
  onBack, 
  connectYouTube, 
  youtubeToken,
  youtubeLoading,
  youtubeError,
  canGoNext 
}) => {
  if (youtubeToken) {
    return (
      <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            ✅ YouTube Connected!
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Your YouTube account is ready.
          </Typography>
          <Button 
            variant="contained" 
            onClick={onNext}
            size="large"
          >
            Continue to Transfer
          </Button>
          <Button 
            variant="text" 
            onClick={onBack}
            sx={{ ml: 2 }}
          >
            Back
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom align="center">
          Connect YouTube
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
          Now let's connect your YouTube account. Nabbit will create playlists in your
          YouTube Music library.
        </Typography>
        
        <Box component="ul" sx={{ mb: 4, pl: 2 }}>
          <li>Your channel information</li>
          <li>Create and manage playlists</li>
          <li>Add videos to playlists</li>
        </Box>

        <Alert severity="info" sx={{ mb: 4 }}>
          Playlists will be created as <strong>private</strong> by default.
        </Alert>

        {youtubeError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {youtubeError}
          </Alert>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="outlined" onClick={onBack}>
            Back
          </Button>
          <Button 
            variant="contained" 
            onClick={connectYouTube}
            size="large"
            disabled={youtubeLoading}
            startIcon={youtubeLoading ? <CircularProgress size={20} /> : <YouTubeIcon />}
            sx={{ minWidth: '200px', bgcolor: '#FF0000', '&:hover': { bgcolor: '#CC0000' } }}
          >
            {youtubeLoading ? 'Connecting...' : 'Connect to YouTube'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ConnectYouTube;