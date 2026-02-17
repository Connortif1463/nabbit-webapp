import { useState, useEffect, useCallback } from 'react';
import { 
  redirectToYouTubeAuth, 
  getYouTubeToken, 
  fetchYouTubeChannel, 
  fetchYouTubePlaylists,
  createYouTubePlaylist,
  searchYouTubeVideo,
  addVideoToPlaylist
} from '../services/youtube';

export const useYouTube = () => {
  const [youtubeToken, setYoutubeToken] = useState(null);
  const [youtubeChannel, setYoutubeChannel] = useState(null);
  const [youtubePlaylists, setYoutubePlaylists] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load token from storage on mount
  useEffect(() => {
    const token = localStorage.getItem('youtube_token');
    if (token) {
      setYoutubeToken(token);
      loadYouTubeData(token);
    }

    // Handle OAuth callback
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    
    if (code && state === 'youtube') {
      handleYouTubeCallback(code);
    }
  }, []);

  const handleYouTubeCallback = async (code) => {
    setLoading(true);
    setError(null);
    try {
      const token = await getYouTubeToken(code);
      localStorage.setItem('youtube_token', token);
      setYoutubeToken(token);
      await loadYouTubeData(token);
      
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadYouTubeData = async (token) => {
    setLoading(true);
    try {
      const channel = await fetchYouTubeChannel(token);
      setYoutubeChannel(channel);
      
      const playlists = await fetchYouTubePlaylists(token);
      setYoutubePlaylists(playlists);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const connectYouTube = useCallback(() => {
    localStorage.setItem('oauth_state', 'youtube');
    redirectToYouTubeAuth();
  }, []);

  const createPlaylist = useCallback(async (title, description, privacyStatus = 'private') => {
    if (!youtubeToken) return null;
    try {
      return await createYouTubePlaylist(title, description, privacyStatus, youtubeToken);
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, [youtubeToken]);

  const findVideo = useCallback(async (query) => {
    if (!youtubeToken) return null;
    try {
      return await searchYouTubeVideo(query, youtubeToken);
    } catch (err) {
      console.error('Error finding video:', err);
      return null;
    }
  }, [youtubeToken]);

  const addVideo = useCallback(async (playlistId, videoId) => {
    if (!youtubeToken) return false;
    try {
      return await addVideoToPlaylist(playlistId, videoId, youtubeToken);
    } catch (err) {
      console.error('Error adding video:', err);
      return false;
    }
  }, [youtubeToken]);

  const clearYouTube = useCallback(() => {
    localStorage.removeItem('youtube_token');
    localStorage.removeItem('oauth_state');
    setYoutubeToken(null);
    setYoutubeChannel(null);
    setYoutubePlaylists(null);
  }, []);

  return {
    youtubeToken,
    youtubeChannel,
    youtubePlaylists,
    loading,
    error,
    connectYouTube,
    createPlaylist,
    findVideo,
    addVideo,
    clearYouTube
  };
};