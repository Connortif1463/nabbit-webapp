import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent
} from '@mui/material';

const Landing = ({ onNext }) => {
  return (
    <Box sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h1" component="h1" sx={{ fontSize: '4rem', mb: 2, fontWeight: 'bold' }}>
        Nabbit
      </Typography>
      <Typography variant="h5" color="text.secondary" sx={{ mb: 6 }}>
        Transfer your Spotify playlists to YouTube Music
      </Typography>

      <Button
        variant="contained"
        size="large"
        onClick={onNext}
        sx={{
          minWidth: '250px',
          py: 2,
          fontSize: '1.3rem',
          mb: 8
        }}
      >
        Get Started
      </Button>
      <Card>
        <CardContent>
          <Typography variant="h2" sx={{ fontSize: '3rem', mb: 2 }}>1️</Typography>
          <Typography variant="h6" gutterBottom>Connect Spotify</Typography>
          <Typography variant="body2" color="text.secondary">
            Link your Spotify account to access your playlists
          </Typography>
        </CardContent>
      </Card>
        <Card>
          <CardContent>
            <Typography variant="h2" sx={{ fontSize: '3rem', mb: 2 }}>2️</Typography>
            <Typography variant="h6" gutterBottom>Connect YouTube</Typography>
            <Typography variant="body2" color="text.secondary">
              Link your YouTube account to create playlists
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h2" sx={{ fontSize: '3rem', mb: 2 }}>3️</Typography>
            <Typography variant="h6" gutterBottom>Choose & Transfer</Typography>
            <Typography variant="body2" color="text.secondary">
              Select playlists and Nabbit does the rest
            </Typography>
          </CardContent>
        </Card>
    </Box>
  );
};

export default Landing;