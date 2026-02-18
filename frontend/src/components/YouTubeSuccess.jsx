import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Avatar,
  Chip
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const YouTubeSuccess = ({ 
  onNext, 
  onBack, 
  youtubeChannel,
  clearYouTube 
}) => {
  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <CheckCircleIcon 
          color="success" 
          sx={{ fontSize: 64, mb: 2 }}
        />
        
        <Typography variant="h4" gutterBottom>
          Awesome! 🎉
        </Typography>
        
        <Typography variant="h6" gutterBottom>
          Your YouTube account is connected
        </Typography>

        {youtubeChannel && (
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
            {youtubeChannel.snippet?.thumbnails?.default?.url && (
              <Avatar 
                src={youtubeChannel.snippet.thumbnails.default.url} 
                alt={youtubeChannel.snippet.title}
                sx={{ width: 56, height: 56 }}
              />
            )}
            <Box textAlign="left">
              <Typography variant="subtitle1">
                {youtubeChannel.snippet?.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {parseInt(youtubeChannel.statistics?.subscriberCount || 0).toLocaleString()} subscribers
              </Typography>
              <Chip 
                label={`${parseInt(youtubeChannel.statistics?.videoCount || 0).toLocaleString()} videos`} 
                size="small" 
                sx={{ mt: 1 }}
              />
            </Box>
          </Box>
        )}

        <Typography variant="body1" sx={{ mb: 4 }}>
          Ready to choose which playlists to transfer!
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
            Choose Playlists
          </Button>
        </Box>

        <Button 
          variant="text" 
          onClick={clearYouTube}
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

export default YouTubeSuccess;