import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Grid,
  Divider,
  Chip,
  Alert
} from '@mui/material';

const TransferSelection = ({ 
  onNext, 
  onBack, 
  spotifyPlaylists,
  selectedPlaylists,
  setSelectedPlaylists,
  youtubePlaylists
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!spotifyPlaylists?.items) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography>Loading your playlists...</Typography>
      </Box>
    );
  }

  const handleToggle = (playlistId) => {
    const currentIndex = selectedPlaylists.indexOf(playlistId);
    const newSelected = [...selectedPlaylists];

    if (currentIndex === -1) {
      newSelected.push(playlistId);
    } else {
      newSelected.splice(currentIndex, 1);
    }

    setSelectedPlaylists(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedPlaylists.length === spotifyPlaylists.items.length) {
      setSelectedPlaylists([]);
    } else {
      setSelectedPlaylists(spotifyPlaylists.items.map(p => p.id));
    }
  };

  const filteredPlaylists = spotifyPlaylists.items.filter(playlist =>
    playlist.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 2 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Choose Playlists to Transfer
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Select which playlists you want to transfer to YouTube Music.
          They will be created as <strong>private playlists</strong>.
        </Typography>

        {/* Summary chips */}
        <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip 
            label={`${spotifyPlaylists.items.length} total playlists`} 
            variant="outlined" 
          />
          <Chip 
            label={`${selectedPlaylists.length} selected`} 
            color="primary" 
            variant={selectedPlaylists.length > 0 ? "filled" : "outlined"}
          />
          {youtubePlaylists?.items && (
            <Chip 
              label={`${youtubePlaylists.items.length} existing YouTube playlists`} 
              variant="outlined" 
            />
          )}
        </Box>

        {/* Select all row */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 2,
          p: 1,
          bgcolor: '#f5f5f5',
          borderRadius: 1
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Checkbox
              checked={selectedPlaylists.length === spotifyPlaylists.items.length}
              indeterminate={selectedPlaylists.length > 0 && selectedPlaylists.length < spotifyPlaylists.items.length}
              onChange={handleSelectAll}
            />
            <Typography variant="subtitle2">Select All</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {selectedPlaylists.length} of {spotifyPlaylists.items.length} selected
          </Typography>
        </Box>

        {/* Playlist list */}
        <List sx={{ 
          maxHeight: '400px', 
          overflow: 'auto',
          border: '1px solid #e0e0e0',
          borderRadius: 1,
          mb: 3
        }}>
          {filteredPlaylists.map((playlist) => {
            const labelId = `checkbox-list-label-${playlist.id}`;
            const isSelected = selectedPlaylists.includes(playlist.id);

            return (
              <ListItem 
                key={playlist.id} 
                button 
                onClick={() => handleToggle(playlist.id)}
                sx={{
                  bgcolor: isSelected ? 'action.selected' : 'inherit',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={isSelected}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                </ListItemIcon>
                <ListItemText 
                  id={labelId}
                  primary={playlist.name}
                  secondary={
                    <React.Fragment>
                      {playlist.tracks.total} tracks
                      {playlist.description && ` • ${playlist.description.substring(0, 50)}...`}
                    </React.Fragment>
                  }
                />
                {playlist.tracks.total > 0 && (
                  <Chip 
                    label={playlist.tracks.total} 
                    size="small" 
                    variant="outlined"
                  />
                )}
              </ListItem>
            );
          })}
        </List>

        {/* Navigation */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button variant="outlined" onClick={onBack}>
            Back
          </Button>
          <Button 
            variant="contained" 
            onClick={onNext}
            disabled={selectedPlaylists.length === 0}
            size="large"
          >
            Transfer {selectedPlaylists.length} Playlist{selectedPlaylists.length !== 1 ? 's' : ''}
          </Button>
        </Box>

        {/* Info about duplicates */}
        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body2">
            Nabbit will check if these playlists have been transferred before.
            If a playlist already exists, you'll be able to choose whether to merge,
            overwrite, or skip it.
          </Typography>
        </Alert>
      </Paper>
    </Box>
  );
};

export default TransferSelection;