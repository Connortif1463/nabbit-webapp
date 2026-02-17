import React from 'react';
import { Button, Typography, Box } from '@mui/material'; // Ready for MUI

const Landing = ({ onNext }) => {
  return (
    <Box sx={{ 
      textAlign: 'center', 
      mt: 8,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 4
    }}>
      {/* Logo area */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h1" component="h1" sx={{ fontSize: '4rem', mb: 2 }}>
          Nabbit
        </Typography>
        <Typography variant="h5" color="text.secondary">
          Transfer your Spotify playlists to YouTube Music
        </Typography>
      </Box>

      {/* Get Started button */}
      <Button 
        variant="contained" 
        size="large"
        onClick={onNext}
        sx={{ 
          minWidth: '200px',
          py: 1.5,
          fontSize: '1.2rem'
        }}
      >
        Get Started
      </Button>

      {/* Simple feature list */}
      <Box sx={{ mt: 6, textAlign: 'left', maxWidth: '400px' }}>
        <Typography variant="body1" align='center' sx={{ mb: 1 }}>Connect your Spotify account</Typography>
        <Typography variant="body1" align='center' sx={{ mb: 1 }}>Connect your YouTube account</Typography>
        <Typography variant="body1" align='center' sx={{ mb: 1 }}>Choose playlists to transfer</Typography>
        <Typography variant="body1" align='center' >Nabbit does the rest</Typography>
      </Box>
    </Box>
  );
};

export default Landing;