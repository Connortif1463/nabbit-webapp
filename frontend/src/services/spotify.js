// src/services/spotify.js
import { generateCodeVerifier, generateCodeChallenge } from './utils/pkce';

const SPOTIFY_CONFIG = {
    clientId: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
    redirectUri: window.location.origin + '/callback',
    scopes: ['user-read-private', 'user-read-email', 'playlist-read-private', 'playlist-read-collaborative']
};

// Cache for track data to avoid redundant calls
const trackCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Redirect to Spotify authorization
export async function redirectToSpotifyAuth() {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);
    const state = 'spotify';

    localStorage.setItem('spotify_verifier', verifier);
    localStorage.setItem('spotify_state', state);

    const params = new URLSearchParams({
        client_id: SPOTIFY_CONFIG.clientId,
        response_type: 'code',
        redirect_uri: SPOTIFY_CONFIG.redirectUri,
        scope: SPOTIFY_CONFIG.scopes.join(' '),
        code_challenge_method: 'S256',
        code_challenge: challenge,
        state: state
    });

    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

// Exchange code for access token
export async function getSpotifyToken(code) {
    const verifier = localStorage.getItem('spotify_verifier');
    
    const params = new URLSearchParams({
        client_id: SPOTIFY_CONFIG.clientId,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: SPOTIFY_CONFIG.redirectUri,
        code_verifier: verifier
    });

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error_description || 'Failed to get token');
    }

    const data = await response.json();
    return data.access_token;
}

// Fetch user profile
export async function fetchSpotifyProfile(token) {
    const response = await fetch('https://api.spotify.com/v1/me', {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch profile');
    }

    return await response.json();
}

// Fetch all playlists (handles pagination)
export async function fetchAllSpotifyPlaylists(token, limit = 50) {
    let allPlaylists = [];
    let url = `https://api.spotify.com/v1/me/playlists?limit=${limit}`;
    
    while (url) {
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch playlists: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        allPlaylists = [...allPlaylists, ...data.items];
        url = data.next; // Get next page URL
    }
    
    return { items: allPlaylists };
}

// Fetch tracks for a specific playlist (maintains order)
export async function fetchPlaylistTracks(playlistId, token, limit = 100) {
    // Check cache first
    const cacheKey = `tracks-${playlistId}`;
    const cached = trackCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log(`📦 Using cached tracks for playlist ${playlistId}`);
        return cached.data;
    }
    
    let allTracks = [];
    let url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=${limit}`;
    
    while (url) {
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch tracks: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Extract track objects and maintain order
        const tracks = data.items
            .filter(item => item.track) // Remove any null tracks
            .map(item => ({
                ...item.track,
                added_at: item.added_at,
                added_by: item.added_by
            }));
        
        allTracks = [...allTracks, ...tracks];
        url = data.next; // Get next page URL
    }
    
    // Store in cache
    trackCache.set(cacheKey, {
        data: allTracks,
        timestamp: Date.now()
    });
    
    return allTracks;
}

// Fetch playlists WITH their tracks (maintains order)
export async function fetchSpotifyPlaylistsWithTracks(token, playlistLimit = 50, tracksPerPlaylist = 100) {
    console.log('🔍 Fetching playlists with tracks...');
    
    // First, get all playlists
    const playlistsData = await fetchAllSpotifyPlaylists(token, playlistLimit);
    const playlists = playlistsData.items;
    
    console.log(`📋 Found ${playlists.length} playlists`);
    
    // For each playlist, fetch its tracks
    const playlistsWithTracks = await Promise.all(
        playlists.map(async (playlist) => {
            try {
                console.log(`🎵 Fetching tracks for: ${playlist.name}`);
                
                const tracks = await fetchPlaylistTracks(playlist.id, token, tracksPerPlaylist);
                
                return {
                    ...playlist,
                    tracks: {
                        ...playlist.tracks,
                        items: tracks, // Actual track objects in correct order
                        total: tracks.length
                    }
                };
            } catch (error) {
                console.error(`❌ Failed to fetch tracks for ${playlist.name}:`, error);
                // Return playlist with empty tracks array if fetch fails
                return {
                    ...playlist,
                    tracks: {
                        ...playlist.tracks,
                        items: [],
                        total: 0,
                        fetchError: error.message
                    }
                };
            }
        })
    );
    
    console.log('✅ All playlists with tracks fetched');
    return { items: playlistsWithTracks };
}

// For backward compatibility - just fetches playlist metadata
export async function fetchSpotifyPlaylists(token, limit = 50) {
    return fetchAllSpotifyPlaylists(token, limit);
}

// Clear track cache (useful for testing or when you need fresh data)
export function clearTrackCache() {
    trackCache.clear();
    console.log('🧹 Track cache cleared');
}