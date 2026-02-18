import { generateCodeVerifier, generateCodeChallenge } from './utils/pkce';

const SPOTIFY_CONFIG = {
    clientId: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
    redirectUri: window.location.origin + '/callback',
    scopes: ['user-read-private', 'user-read-email', 'playlist-read-private', 'playlist-read-collaborative']
};

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

export async function fetchSpotifyProfile(token) {
    const response = await fetch('https://api.spotify.com/v1/me', {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch profile');
    }

    return await response.json();
}

export async function fetchSpotifyPlaylists(token, limit = 50) {
    console.log('🔍 Fetching playlists with token:', token ? token.substring(0, 20) + '...' : 'NO TOKEN');
    
    try {
        const response = await fetch(
            `https://api.spotify.com/v1/me/playlists?limit=${limit}`,
            { headers: { 'Authorization': `Bearer ${token}` } }
        );
        
        console.log('📊 Response status:', response.status);
        console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));
        
        // Get the response text first to see what's really coming back
        const responseText = await response.text();
        console.log('📄 Raw response:', responseText.substring(0, 200)); // First 200 chars
        
        if (!response.ok) {
            // Try to parse as JSON, but if it fails, show the text
            try {
                const errorJson = JSON.parse(responseText);
                console.error('❌ Spotify error:', errorJson);
                throw new Error(errorJson.error?.message || `HTTP ${response.status}`);
            } catch (e) {
                console.error('❌ Raw error response:', responseText);
                throw new Error(`HTTP ${response.status}: ${responseText.substring(0, 100)}`);
            }
        }
        
        // Parse the successful response
        const data = JSON.parse(responseText);
        console.log('✅ Playlists fetched:', data);
        return data;
        
    } catch (error) {
        console.error('💥 Fetch error:', error);
        throw error;
    }
}

export async function fetchPlaylistTracks(playlistId, token, limit = 100) {
    const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=${limit}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
    );

    if (!response.ok) {
        throw new Error('Failed to fetch tracks');
    }

    const data = await response.json();
    return data.items;
}