import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  redirectToSpotifyAuth, 
  getSpotifyToken, 
  fetchSpotifyProfile, 
  fetchSpotifyPlaylists,
  fetchPlaylistTracks
} from '../services/spotify';

export const useSpotify = () => {
  const [spotifyToken, setSpotifyToken] = useState(null);
  const [spotifyProfile, setSpotifyProfile] = useState(null);
  const [spotifyPlaylists, setSpotifyPlaylists] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Add this ref to prevent duplicate calls
  const hasLoadedRef = useRef(false);

  useEffect(() => {
      const token = localStorage.getItem('spotify_token');
      if (token && !hasLoadedRef.current) {
          hasLoadedRef.current = true; // Set it immediately
          setSpotifyToken(token);
          loadSpotifyData(token);
      }

      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');
      
      if (code && state === 'spotify') {
          handleSpotifyCallback(code);
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
      
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadSpotifyData = async (token) => {
    setLoading(true);
    try {
      const profile = await fetchSpotifyProfile(token);
      setSpotifyProfile(profile);
      
      const playlists = await fetchSpotifyPlaylists(token);
      setSpotifyPlaylists(playlists);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const connectSpotify = useCallback(() => {
    localStorage.setItem('oauth_state', 'spotify');
    redirectToSpotifyAuth();
  }, []);

  const getPlaylistTracks = useCallback(async (playlistId, limit = 100) => {
    if (!spotifyToken) return [];
    try {
      return await fetchPlaylistTracks(playlistId, spotifyToken, limit);
    } catch (err) {
      setError(err.message);
      return [];
    }
  }, [spotifyToken]);

  const clearSpotify = useCallback(() => {
    localStorage.removeItem('spotify_token');
    localStorage.removeItem('oauth_state');
    setSpotifyToken(null);
    setSpotifyProfile(null);
    setSpotifyPlaylists(null);
  }, []);

  return {
    spotifyToken,
    spotifyProfile,
    spotifyPlaylists,
    loading,
    error,
    connectSpotify,
    getPlaylistTracks,
    clearSpotify
  };
};