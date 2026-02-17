// src/services/youtube.js
import { generateCodeVerifier, generateCodeChallenge } from './utils/pkce';

const YOUTUBE_CONFIG = {
    clientId: import.meta.env.VITE_YOUTUBE_CLIENT_ID,
    redirectUri: window.location.origin + '/',
    scopes: ['https://www.googleapis.com/auth/youtube', 'https://www.googleapis.com/auth/youtube.force-ssl']
};

export async function redirectToYouTubeAuth() {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);
    const state = 'youtube';

    localStorage.setItem('youtube_verifier', verifier);
    localStorage.setItem('youtube_state', state);

    const params = new URLSearchParams({
        client_id: YOUTUBE_CONFIG.clientId,
        redirect_uri: YOUTUBE_CONFIG.redirectUri,
        response_type: 'code',
        scope: YOUTUBE_CONFIG.scopes.join(' '),
        code_challenge_method: 'S256',
        code_challenge: challenge,
        state: state,
        access_type: 'offline',
        prompt: 'consent'
    });

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function getYouTubeToken(code) {
    const verifier = localStorage.getItem('youtube_verifier');
    
    const params = new URLSearchParams({
        client_id: YOUTUBE_CONFIG.clientId,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: YOUTUBE_CONFIG.redirectUri,
        code_verifier: verifier
    });

    const response = await fetch('https://oauth2.googleapis.com/token', {
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

export async function fetchYouTubeChannel(token) {
    const response = await fetch(
        'https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails&mine=true',
        { headers: { 'Authorization': `Bearer ${token}` } }
    );

    if (!response.ok) {
        throw new Error('Failed to fetch channel');
    }

    const data = await response.json();
    return data.items && data.items[0] ? data.items[0] : null;
}

export async function fetchYouTubePlaylists(token, maxResults = 50) {
    const response = await fetch(
        `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&mine=true&maxResults=${maxResults}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
    );

    if (!response.ok) {
        throw new Error('Failed to fetch playlists');
    }

    return await response.json();
}

export async function createYouTubePlaylist(title, description = '', privacyStatus = 'private', token) {
    const response = await fetch('https://www.googleapis.com/youtube/v3/playlists?part=snippet,status', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            snippet: {
                title: title,
                description: description
            },
            status: {
                privacyStatus: privacyStatus
            }
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to create playlist');
    }

    return await response.json();
}

export async function searchYouTubeVideo(query, token) {
    const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=1`,
        { headers: { 'Authorization': `Bearer ${token}` } }
    );

    if (!response.ok) {
        return null;
    }

    const data = await response.json();
    return data.items && data.items[0] ? data.items[0].id.videoId : null;
}

export async function addVideoToPlaylist(playlistId, videoId, token) {
    const response = await fetch('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            snippet: {
                playlistId: playlistId,
                resourceId: {
                    kind: 'youtube#video',
                    videoId: videoId
                }
            }
        })
    });

    return response.ok;
}