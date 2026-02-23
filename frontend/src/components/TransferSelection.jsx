import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Chip,
  TextField,
  InputAdornment,
  Alert,
  Divider,
  CircularProgress,
  Collapse,
  IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

const TransferSelection = ({ 
  onNext, 
  onBack, 
  spotifyPlaylists,
  selectedPlaylists,
  setSelectedPlaylists,
  youtubePlaylists,
  onTransfer,
  spotifyLoading,
  getPlaylistStats
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedPlaylist, setExpandedPlaylist] = useState(null);
  const [playlistStats, setPlaylistStats] = useState(null);

  useEffect(() => {
    if (getPlaylistStats) {
      const stats = getPlaylistStats();
      setPlaylistStats(stats);
      console.log('📊 Playlist stats:', stats);
    }
  }, [spotifyPlaylists, getPlaylistStats]);

  // Handle loading state
  if (spotifyLoading) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, textAlign: 'center' }}>
        <Paper sx={{ p: 4 }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Loading your playlists and tracks...</Typography>
        </Paper>
      </Box>
    );
  }

  // Handle no playlists
  if (!spotifyPlaylists?.items || spotifyPlaylists.items.length === 0) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            No playlists found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            You don't have any playlists in your Spotify account to transfer.
          </Typography>
          <Button variant="contained" onClick={onBack}>
            Go Back
          </Button>
        </Paper>
      </Box>
    );
  }

  const handleToggle = (playlistId) => {
    if (!playlistId) return;
    
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
    if (!spotifyPlaylists?.items) return;
    
    const validPlaylistIds = spotifyPlaylists.items
      .filter(p => p && p.id)
      .map(p => p.id);
    
    if (selectedPlaylists.length === validPlaylistIds.length) {
      setSelectedPlaylists([]);
    } else {
      setSelectedPlaylists(validPlaylistIds);
    }
  };

  const toggleExpand = (playlistId) => {
    setExpandedPlaylist(expandedPlaylist === playlistId ? null : playlistId);
  };

  // Filter playlists, skipping any invalid ones
  const filteredPlaylists = spotifyPlaylists.items
    .filter(playlist => playlist && playlist.name)
    .filter(playlist =>
      playlist.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Calculate total tracks safely
  const totalTracks = selectedPlaylists.reduce((sum, id) => {
    const playlist = spotifyPlaylists.items.find(p => p && p.id === id);
    return sum + (playlist?.tracks?.total || 0);
  }, 0);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 2 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Choose Playlists to Transfer
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Select which playlists you want to transfer to YouTube Music.
          They will be created as <strong>private playlists</strong> with all tracks in the original order.
        </Typography>

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
          {selectedPlaylists.length > 0 && (
            <Chip 
              label={`${totalTracks} total tracks`} 
              variant="outlined"
            />
          )}
        </Box>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search playlists..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

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
              checked={selectedPlaylists.length === filteredPlaylists.length && filteredPlaylists.length > 0}
              indeterminate={selectedPlaylists.length > 0 && selectedPlaylists.length < filteredPlaylists.length}
              onChange={handleSelectAll}
            />
            <Typography variant="subtitle2">Select All</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {selectedPlaylists.length} of {filteredPlaylists.length} selected
          </Typography>
        </Box>

        <List sx={{ 
          maxHeight: '500px', 
          overflow: 'auto',
          border: '1px solid #e0e0e0',
          borderRadius: 1,
          mb: 3
        }}>
          {filteredPlaylists.map((playlist) => {
            if (!playlist) return null;
            
            const isSelected = playlist.id ? selectedPlaylists.includes(playlist.id) : false;
            const isExpanded = expandedPlaylist === playlist.id;
            const trackCount = playlist.tracks?.total || 0;
            const tracks = playlist.tracks?.items || [];
            
            return (
              <React.Fragment key={playlist.id}>
                <ListItem 
                  button 
                  onClick={() => playlist.id && handleToggle(playlist.id)}
                  sx={{
                    bgcolor: isSelected ? 'action.selected' : 'inherit',
                    '&:hover': { bgcolor: 'action.hover' },
                    borderBottom: isExpanded ? '1px solid #e0e0e0' : 'none'
                  }}
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={isSelected}
                      disabled={!playlist.id}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <PlaylistPlayIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <ListItemText 
                    primary={playlist.name || 'Untitled Playlist'}
                    secondary={
                      <Box>
                        <span>{trackCount} tracks</span>
                        {tracks.length > 0 && (
                          <span> • First: {tracks[0]?.name} by {tracks[0]?.artists?.[0]?.name}</span>
                        )}
                      </Box>
                    }
                  />
                  <Chip 
                    label={trackCount} 
                    size="small" 
                    variant="outlined"
                    sx={{ mr: 1 }}
                  />
                  <IconButton 
                    size="small" 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(playlist.id);
                    }}
                  >
                    {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </ListItem>
                
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  <Box sx={{ pl: 9, pr: 2, py: 1, bgcolor: '#fafafa' }}>
                    {tracks.length > 0 ? (
                      tracks.slice(0, 10).map((track, index) => (
                        <Box 
                          key={track.id || index} 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            py: 0.5,
                            fontSize: '0.9rem'
                          }}
                        >
                          <MusicNoteIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2" noWrap sx={{ flex: 1 }}>
                            {index + 1}. {track.name} - {track.artists?.map(a => a.name).join(', ')}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {Math.floor(track.duration_ms / 60000)}:
                            {Math.floor((track.duration_ms % 60000) / 1000).toString().padStart(2, '0')}
                          </Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
                        No tracks found for this playlist
                      </Typography>
                    )}
                    {tracks.length > 10 && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                        ... and {tracks.length - 10} more tracks
                      </Typography>
                    )}
                  </Box>
                </Collapse>
              </React.Fragment>
            );
          })}
        </List>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button variant="outlined" onClick={onBack}>
            Back
          </Button>
          <Button 
            variant="contained" 
            onClick={onTransfer}
            disabled={selectedPlaylists.length === 0}
            size="large"
          >
            Transfer {selectedPlaylists.length} Playlist{selectedPlaylists.length !== 1 ? 's' : ''}
            {selectedPlaylists.length > 0 && ` (${totalTracks} tracks)`}
          </Button>
        </Box>

        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body2">
            Nabbit will transfer all tracks in their original order. 
            If a playlist already exists on YouTube, you'll be able to choose whether to merge,
            overwrite, or skip it.
          </Typography>
        </Alert>
      </Paper>
    </Box>
  );
};

export default TransferSelection;