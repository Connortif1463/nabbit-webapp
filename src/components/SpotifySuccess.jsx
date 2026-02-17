import React from 'react';
import { Button, Typography, Box, Paper, Avatar } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const SpotifySuccess = ({ 
  onNext, 
  onBack, 
  spotifyProfile,
  clearSpotify 
}) => {
  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <CheckCircleIcon 
          color="success" 
          sx={{ fontSize: 64, mb: 2 }}
        />
        
        <Typography variant="h4" gutterBottom>
          Yay! 🎉
        </Typography>
        
        <Typography variant="h6" gutterBottom>
          You've connected your Spotify account
        </Typography>

        {spotifyProfile && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: 2,
            my: 3,
            p: 2,
            bgcolor: '#f5f5f5',
            borderRadius: 2
          }}>
            {spotifyProfile.images?.[0]?.url && (
              <Avatar 
                src={spotifyProfile.images[0].url} 
                alt={spotifyProfile.display_name}
              />
            )}
            <Box textAlign="left">
              <Typography variant="subtitle1">
                {spotifyProfile.display_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {spotifyProfile.email}
              </Typography>
            </Box>
          </Box>
        )}

        <Typography variant="body1" sx={{ mb: 4 }}>
          Next, we'll connect your YouTube account to transfer your playlists.
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button variant="outlined" onClick={onBack}>
            Back
          </Button>
          <Button 
            variant="contained" 
            onClick={onNext}
            size="large"
          >
            Next
          </Button>
        </Box>

        <Button 
          variant="text" 
          onClick={clearSpotify}
          sx={{ mt: 2 }}
          color="error"
          size="small"
        >
          Use different account
        </Button>
      </Paper>
    </Box>
  );
};

export default SpotifySuccess;