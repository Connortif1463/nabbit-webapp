// src/hooks/useSpotify.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  redirectToSpotifyAuth, 
  getSpotifyToken, 
  fetchSpotifyProfile, 
  fetchSpotifyPlaylistsWithTracks,
  fetchPlaylistTracks,
  clearTrackCache
} from '../services/spotify';

export const useSpotify = () => {
  const [spotifyToken, setSpotifyToken] = useState(null);
  const [spotifyProfile, setSpotifyProfile] = useState(null);
  const [spotifyPlaylists, setSpotifyPlaylists] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Add ref to prevent duplicate calls
  const hasLoadedRef = useRef(false);
  const initializingRef = useRef(false);

  // Load token from storage on mount
  useEffect(() => {
    // Prevent multiple initializations
    if (initializingRef.current) return;
    initializingRef.current = true;

    const token = localStorage.getItem('spotify_token');
    if (token && !hasLoadedRef.current) {
      hasLoadedRef.current = true;
      setSpotifyToken(token);
      loadSpotifyData(token);
    }

    // Handle OAuth callback
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    
    if (code && state === 'spotify') {
      handleSpotifyCallback(code);
    }

    // Clean up URL if needed
    if (code || params.get('error')) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []); // Empty deps array - runs once

  const handleSpotifyCallback = async (code) => {
    setLoading(true);
    setError(null);
    try {
      const token = await getSpotifyToken(code);
      localStorage.setItem('spotify_token', token);
      setSpotifyToken(token);
      await loadSpotifyData(token);
    } catch (err) {
      setError(err.message);
      console.error('Spotify callback error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSpotifyData = async (token) => {
    setLoading(true);
    setError(null);
    
    try {
      // Add small delay to prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Fetch profile
      console.log('📊 Fetching Spotify profile...');
      const profile = await fetchSpotifyProfile(token);
      setSpotifyProfile(profile);
      
      // Add delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Fetch playlists WITH tracks (maintains order)
      console.log('📋 Fetching playlists with tracks...');
      const playlistsWithTracks = await fetchSpotifyPlaylistsWithTracks(token, 50, 100);
      setSpotifyPlaylists(playlistsWithTracks);
      
      console.log('✅ Spotify data loaded successfully');
      
    } catch (err) {
      setError(err.message);
      console.error('Failed to load Spotify data:', err);
      
      // If token expired, clear it
      if (err.message.includes('401') || err.message.includes('expired')) {
        localStorage.removeItem('spotify_token');
        setSpotifyToken(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const connectSpotify = useCallback(() => {
    // Clear any existing state before connecting
    hasLoadedRef.current = false;
    localStorage.removeItem('spotify_token');
    localStorage.setItem('oauth_state', 'spotify');
    redirectToSpotifyAuth();
  }, []);

  const getPlaylistTracks = useCallback(async (playlistId, limit = 100) => {
    if (!spotifyToken) {
      console.error('No Spotify token available');
      return [];
    }
    
    try {
      console.log(`🎵 Fetching tracks for playlist: ${playlistId}`);
      const tracks = await fetchPlaylistTracks(playlistId, spotifyToken, limit);
      return tracks;
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch playlist tracks:', err);
      return [];
    }
  }, [spotifyToken]);

  const refreshSpotifyData = useCallback(async () => {
    if (!spotifyToken) {
      console.error('Cannot refresh - no token');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Clear cache to force fresh data
      clearTrackCache();
      
      await loadSpotifyData(spotifyToken);
      console.log('🔄 Spotify data refreshed');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [spotifyToken]);

  const clearSpotify = useCallback(() => {
    localStorage.removeItem('spotify_token');
    localStorage.removeItem('oauth_state');
    localStorage.removeItem('spotify_verifier');
    localStorage.removeItem('spotify_state');
    
    // Clear cache
    clearTrackCache();
    
    setSpotifyToken(null);
    setSpotifyProfile(null);
    setSpotifyPlaylists(null);
    setError(null);
    hasLoadedRef.current = false;
    
    console.log('👋 Spotify signed out');
  }, []);

  // Debug helper
  const getPlaylistStats = useCallback(() => {
    if (!spotifyPlaylists?.items) return null;
    
    return spotifyPlaylists.items.map(playlist => ({
      name: playlist.name,
      trackCount: playlist.tracks?.total || 0,
      hasTracks: !!(playlist.tracks?.items?.length > 0),
      id: playlist.id
    }));
  }, [spotifyPlaylists]);

  return {
    // State
    spotifyToken,
    spotifyProfile,
    spotifyPlaylists,
    loading,
    error,
    
    // Actions
    connectSpotify,
    clearSpotify,
    getPlaylistTracks,
    refreshSpotifyData,
    getPlaylistStats,
    
    // Helpers
    isAuthenticated: !!spotifyToken
  };
};