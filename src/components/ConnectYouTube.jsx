import React from 'react';
import { Button, Typography, Box, Paper, Alert } from '@mui/material';

const ConnectYouTube = ({ 
  onNext, 
  onBack, 
  connectYouTube, 
  youtubeToken,
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
        <Typography variant="h5" gutterBottom>
          Connect YouTube
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 3 }}>
          Now let's connect your YouTube account. Nabbit will create playlists in your
          YouTube Music library.
        </Typography>
        
        <Box component="ul" sx={{ mb: 4 }}>
          <li>Your channel information</li>
          <li>Create and manage playlists</li>
          <li>Add videos to playlists</li>
        </Box>

        <Alert severity="info" sx={{ mb: 4 }}>
          Playlists will be created as <strong>private</strong> by default.
        </Alert>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="outlined" onClick={onBack}>
            Back
          </Button>
          <Button 
            variant="contained" 
            onClick={connectYouTube}
            size="large"
            sx={{ minWidth: '200px' }}
          >
            Connect to YouTube
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ConnectYouTube;