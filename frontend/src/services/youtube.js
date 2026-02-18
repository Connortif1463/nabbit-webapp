import { generateCodeVerifier, generateCodeChallenge } from './utils/pkce';

const YOUTUBE_CONFIG = {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    redirectUri: window.location.origin + '/',
    scopes: ['https://www.googleapis.com/auth/youtube'],
};

export async function redirectToYouTubeAuth() {
    // This generates and stores the verifier
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);
    const state = 'youtube';

    console.log('🔐 VERIFIER CREATED:', verifier);
    console.log('📦 Storing in localStorage...');
    localStorage.setItem('youtube_verifier', verifier);
    console.log('✅ Stored:', localStorage.getItem('youtube_verifier'));

    // DEFINE PARAMS HERE - before using it!
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

    // Add a small delay so you can see logs (optional)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // THEN redirect
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function getYouTubeToken(code) {
    // Get the verifier from localStorage - it was stored during redirect
    const verifier = localStorage.getItem('youtube_verifier');
    
    if (!verifier) {
        console.error('No code verifier found in localStorage');
        throw new Error('Missing code verifier - please try connecting again');
    }

    console.log('Sending code and verifier to backend:', { code: code.substring(0, 10) + '...', verifier: verifier.substring(0, 10) + '...' });

    const response = await fetch('http://127.0.0.1:8000/api/auth/google/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            code, 
            code_verifier: verifier 
        })
    });

    if (!response.ok) {
        const error = await response.json();
        console.error('Backend error:', error);
        throw new Error(error.detail || 'Failed to get token');
    }

    const data = await response.json();
    
    // Optional: clear verifier after successful use
    localStorage.removeItem('youtube_verifier');
    
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