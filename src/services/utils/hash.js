// src/utils/hash.js

// Generate a hash/fingerprint for a playlist based on its tracks
export const generatePlaylistHash = (tracks) => {
  if (!tracks || tracks.length === 0) return 'empty';
  
  // Create a string of track IDs or names+artists
  const trackString = tracks
    .map(t => {
      // Use track ID if available, otherwise create a key from name and artist
      if (t.id) return t.id;
      const artistName = t.artists && t.artists[0] ? t.artists[0].name : 'unknown';
      return `${t.name}-${artistName}`;
    })
    .sort()
    .join('|');
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < trackString.length; i++) {
    const char = trackString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Return as hex string
  return Math.abs(hash).toString(16);
};

// Compare two playlists to find differences
export const comparePlaylists = (oldTracks, newTracks) => {
  const oldSet = new Set(
    oldTracks.map(t => t.id || `${t.name}-${t.artists?.[0]?.name || 'unknown'}`)
  );
  const newSet = new Set(
    newTracks.map(t => t.id || `${t.name}-${t.artists?.[0]?.name || 'unknown'}`)
  );
  
  const added = newTracks.filter(t => !oldSet.has(t.id || `${t.name}-${t.artists?.[0]?.name || 'unknown'}`));
  const removed = oldTracks.filter(t => !newSet.has(t.id || `${t.name}-${t.artists?.[0]?.name || 'unknown'}`));
  
  return { added, removed };
};