export const generatePlaylistHash = (tracks) => {
  if (!tracks || tracks.length === 0) return 'empty';
  
  const trackString = tracks
    .map(t => {
      if (t.id) return t.id;
      const artistName = t.artists && t.artists[0] ? t.artists[0].name : 'unknown';
      return `${t.name}-${artistName}`;
    })
    .sort()
    .join('|');
  
  let hash = 5381;
  for (let i = 0; i < trackString.length; i++) {
    hash = ((hash << 5) + hash) + trackString.charCodeAt(i);
  }
  
  return Math.abs(hash).toString(16);
};

export const comparePlaylists = (oldTracks, newTracks) => {
  const getKey = (t) => t.id || `${t.name}-${t.artists?.[0]?.name || 'unknown'}`;
  
  const oldSet = new Set(oldTracks.map(getKey));
  const newSet = new Set(newTracks.map(getKey));
  
  const added = newTracks.filter(t => !oldSet.has(getKey(t)));
  const removed = oldTracks.filter(t => !newSet.has(getKey(t)));
  
  return { added, removed };
};