import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Alert,
  CircularProgress
} from '@mui/material';
import SpotifyIcon from '@mui/icons-material/MusicNote';

const ConnectSpotify = ({ 
  onNext, 
  onBack, 
  connectSpotify, 
  spotifyToken,
  spotifyLoading,
  spotifyError,
  canGoNext 
}) => {
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
        <Typography variant="h5" gutterBottom align="center">
          Connect Spotify
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
          To transfer your playlists, Nabbit needs access to your Spotify account.
        </Typography>
        
        <Box component="ul" sx={{ mb: 4, pl: 2 }}>
          <li>Your public profile information</li>
          <li>Your email address</li>
          <li>Your playlists (read-only)</li>
        </Box>

        <Alert severity="info" sx={{ mb: 4 }}>
          We never store your passwords or share your data.
        </Alert>

        {spotifyError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {spotifyError}
          </Alert>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="outlined" onClick={onBack}>
            Back
          </Button>
          <Button 
            variant="contained" 
            onClick={connectSpotify}
            size="large"
            disabled={spotifyLoading}
            startIcon={spotifyLoading ? <CircularProgress size={20} /> : <SpotifyIcon />}
            sx={{ minWidth: '200px' }}
          >
            {spotifyLoading ? 'Connecting...' : 'Connect to Spotify'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ConnectSpotify;