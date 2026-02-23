import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Box,
  Alert,
  Chip
} from '@mui/material';

const DuplicateDialog = ({ 
  open, 
  playlist, 
  existingInfo,
  onClose, 
  onConfirm 
}) => {
  const [action, setAction] = useState('merge');

  if (!playlist) return null;

  const trackDifference = playlist.trackCount - (existingInfo?.trackCount || 0);

  const handleConfirm = () => {
    onConfirm(playlist.spotifyId, action);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Playlist Already Transferred
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          <strong>"{playlist.spotifyName}"</strong> was previously transferred to YouTube.
        </Typography>

        {existingInfo && (
          <Alert severity="info" sx={{ my: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2">
                Last transferred: {new Date(existingInfo.timestamp).toLocaleDateString()}
              </Typography>
              <Typography variant="body2">
                Previous track count: {existingInfo.trackCount}
              </Typography>
              <Typography variant="body2">
                Current track count: {playlist.trackCount}
              </Typography>
              {trackDifference > 0 && (
                <Chip 
                  label={`+${trackDifference} new tracks`} 
                  color="success" 
                  size="small"
                  sx={{ alignSelf: 'flex-start' }}
                />
              )}
              {trackDifference < 0 && (
                <Chip 
                  label={`${trackDifference} tracks removed`} 
                  color="warning" 
                  size="small"
                  sx={{ alignSelf: 'flex-start' }}
                />
              )}
            </Box>
          </Alert>
        )}

        <FormControl component="fieldset" sx={{ mt: 2 }}>
          <FormLabel component="legend">What would you like to do?</FormLabel>
          <RadioGroup value={action} onChange={(e) => setAction(e.target.value)}>
            <FormControlLabel 
              value="merge" 
              control={<Radio />} 
              label="Merge - Add new songs to existing playlist (preserves order)" 
            />
            <FormControlLabel 
              value="overwrite" 
              control={<Radio />} 
              label="Overwrite - Replace entire playlist with current version" 
            />
            <FormControlLabel 
              value="create" 
              control={<Radio />} 
              label="Create New - Make a copy with '(2)' suffix" 
            />
            <FormControlLabel 
              value="skip" 
              control={<Radio />} 
              label="Skip - Don't transfer this playlist" 
            />
          </RadioGroup>
        </FormControl>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {action === 'merge' && "Only songs not already in the YouTube playlist will be added, maintaining their position in the playlist order."}
            {action === 'overwrite' && "The existing YouTube playlist will be completely replaced with the current Spotify version, including all tracks and order."}
            {action === 'create' && "A new playlist will be created with the same name (plus ' (2)'), keeping the current track order."}
            {action === 'skip' && "This playlist will not be transferred."}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleConfirm} variant="contained">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DuplicateDialog;