import React, { useState, useEffect } from 'react';
import { useSpotify } from './hooks/useSpotify';
import { useYouTube } from './hooks/useYouTube';
import { useTransfer } from './hooks/useTransfer';
import Header from './components/Header';
import Layout from './components/Layout';
import Landing from './components/Landing';
import ConnectSpotify from './components/ConnectSpotify';
import SpotifySuccess from './components/SpotifySuccess';
import ConnectYouTube from './components/ConnectYouTube';
import YouTubeSuccess from './components/YouTubeSuccess';
import TransferSelection from './components/TransferSelection';
import TransferProgress from './components/TransferProgress';
import DuplicateDialog from './components/DuplicateDialog';

const STEPS = [
  'landing',
  'spotify',
  'spotify-success',
  'youtube',
  'youtube-success',
  'transfer',
  'transfer-progress'
];

function App() {
  const [currentStep, setCurrentStep] = useState('landing');
  const [transferResults, setTransferResults] = useState(null);
  const [duplicateDialog, setDuplicateDialog] = useState({ open: false, playlist: null });
  const [pendingAction, setPendingAction] = useState(null);
  
  const { 
    spotifyToken, 
    spotifyProfile, 
    spotifyPlaylists,
    loading: spotifyLoading,
    error: spotifyError,
    connectSpotify,
    getPlaylistTracks,
    clearSpotify 
  } = useSpotify();
  
  const { 
    youtubeToken, 
    youtubeChannel, 
    youtubePlaylists,
    loading: youtubeLoading,
    error: youtubeError,
    connectYouTube,
    createPlaylist: youtubeCreatePlaylist,
    findVideo: youtubeFindVideo,
    addVideo: youtubeAddVideo,
    clearYouTube 
  } = useYouTube();

  const {
    selectedPlaylists,
    setSelectedPlaylists,
    transferHistory,
    transferStatus,
    progress,
    duplicates,
    transferPlaylists
  } = useTransfer(
    spotifyPlaylists,
    youtubePlaylists,
    getPlaylistTracks,
    {
      createPlaylist: youtubeCreatePlaylist,
      findVideo: youtubeFindVideo,
      addVideo: youtubeAddVideo
    }
  );

  useEffect(() => {
    if (spotifyToken && currentStep === 'spotify') {
      setCurrentStep('spotify-success');
    }
  }, [spotifyToken, currentStep]);

  useEffect(() => {
    if (youtubeToken && currentStep === 'youtube') {
      setCurrentStep('youtube-success');
    }
  }, [youtubeToken, currentStep]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    const error = params.get('error');

    if (error) {
      console.error('OAuth error:', error);
    }

    if (code || error) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const currentIndex = STEPS.indexOf(currentStep);
  
  const canGoNext = {
    landing: true,
    spotify: !!spotifyToken,
    'spotify-success': true,
    youtube: !!youtubeToken,
    'youtube-success': true,
    transfer: selectedPlaylists.length > 0,
    'transfer-progress': transferStatus === 'complete'
  };

  const goNext = () => {
    if (currentIndex < STEPS.length - 1 && canGoNext[currentStep]) {
      setCurrentStep(STEPS[currentIndex + 1]);
    }
  };

  const goBack = () => {
    if (currentIndex > 0) {
      if (currentStep === 'transfer-progress' && transferStatus === 'transferring') {
        if (window.confirm('Cancel ongoing transfer?')) {
          setCurrentStep(STEPS[currentIndex - 1]);
        }
      } else {
        setCurrentStep(STEPS[currentIndex - 1]);
      }
    }
  };

  const goToLanding = () => {
    if (currentStep !== 'landing') {
      if (transferStatus === 'transferring') {
        if (window.confirm('Go to home? Transfer will be cancelled.')) {
          setCurrentStep('landing');
        }
      } else {
        setCurrentStep('landing');
      }
    }
  };

  const handleTransfer = async () => {
    const dupes = selectedPlaylists
      .map(id => {
        const playlist = spotifyPlaylists?.items?.find(p => p.id === id);
        const history = transferHistory[id];
        return history ? { id, info: history, playlist } : null;
      })
      .filter(d => d !== null);

    if (dupes.length > 0) {
      setDuplicateDialog({ 
        open: true, 
        playlist: {
          spotifyId: dupes[0].id,
          spotifyName: dupes[0].playlist.name,
          trackCount: dupes[0].playlist.tracks.total,
          existingInfo: dupes[0].info
        }
      });
      setPendingAction(dupes);
      return;
    }

    const results = await transferPlaylists({
      maxSongsPerPlaylist: 50,
      privacyStatus: 'private',
      onDuplicate: 'prompt'
    });
    setTransferResults(results);
    setCurrentStep('transfer-progress');
  };

  const handleDuplicateDecision = async (playlistId, action) => {
    if (pendingAction.length > 1) {
      const nextDup = pendingAction[1];
      setDuplicateDialog({ 
        open: true, 
        playlist: {
          spotifyId: nextDup.id,
          spotifyName: nextDup.playlist.name,
          trackCount: nextDup.playlist.tracks.total,
          existingInfo: nextDup.info
        }
      });
      setPendingAction(pendingAction.slice(1));
    } else {
      setDuplicateDialog({ open: false, playlist: null });
      setPendingAction(null);
      
      const results = await transferPlaylists({
        maxSongsPerPlaylist: 50,
        privacyStatus: 'private',
        onDuplicate: action
      });
      setTransferResults(results);
      setCurrentStep('transfer-progress');
    }
  };

  const handleTransferComplete = () => {
    setCurrentStep('transfer');
  };

  const pageProps = {
    onNext: goNext,
    onBack: goBack,
    canGoNext: canGoNext[currentStep],
    spotifyToken,
    spotifyProfile,
    spotifyPlaylists,
    spotifyLoading,
    spotifyError,
    youtubeToken,
    youtubeChannel,
    youtubePlaylists,
    youtubeLoading,
    youtubeError,
    connectSpotify,
    connectYouTube,
    selectedPlaylists,
    setSelectedPlaylists,
    clearSpotify,
    clearYouTube,
    onTransfer: handleTransfer,
    transferStatus,
    progress,
    transferResults
  };

  const renderStep = () => {
    switch(currentStep) {
      case 'landing':
        return <Landing {...pageProps} />;
      case 'spotify':
        return <ConnectSpotify {...pageProps} />;
      case 'spotify-success':
        return <SpotifySuccess {...pageProps} />;
      case 'youtube':
        return <ConnectYouTube {...pageProps} />;
      case 'youtube-success':
        return <YouTubeSuccess {...pageProps} />;
      case 'transfer':
        return <TransferSelection {...pageProps} />;
      case 'transfer-progress':
        return (
          <TransferProgress
            transferStatus={transferStatus}
            progress={progress}
            transferResults={transferResults}
            onComplete={handleTransferComplete}
            onBack={goBack}
          />
        );
      default:
        return <Landing {...pageProps} />;
    }
  };

  const showHeader = currentStep !== 'landing';

  return (
    <>
      {showHeader && <Header onLogoClick={goToLanding} />}
      <Layout>
        {renderStep()}
      </Layout>

      <DuplicateDialog
        open={duplicateDialog.open}
        playlist={duplicateDialog.playlist}
        existingInfo={duplicateDialog.playlist?.existingInfo}
        onClose={() => setDuplicateDialog({ open: false, playlist: null })}
        onConfirm={handleDuplicateDecision}
      />
    </>
  );
}

export default App;