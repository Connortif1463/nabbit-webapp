import React from 'react';
import { Button, Typography, Box, Paper, Alert } from '@mui/material';

const ConnectSpotify = ({ 
  onNext, 
  onBack, 
  connectSpotify, 
  spotifyToken,
  canGoNext 
}) => {
  // If already connected, show success and Next
  if (spotifyToken) {
    return (
      <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            ✅ Spotify Connected!
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Your Spotify account is already connected.
          </Typography>
          <Button 
            variant="contained" 
            onClick={onNext}
            size="large"
          >
            Continue
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
          Connect Spotify
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 3 }}>
          To transfer your playlists, Nabbit needs access to your Spotify account.
          We'll be able to see:
        </Typography>
        
        <Box component="ul" sx={{ mb: 4 }}>
          <li>Your public profile information</li>
          <li>Your email address</li>
          <li>Your playlists (read-only)</li>
        </Box>

        <Alert severity="info" sx={{ mb: 4 }}>
          We never store your passwords or share your data.
        </Alert>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="outlined" onClick={onBack}>
            Back
          </Button>
          <Button 
            variant="contained" 
            onClick={connectSpotify}
            size="large"
            sx={{ minWidth: '200px' }}
          >
            Connect to Spotify
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ConnectSpotify;