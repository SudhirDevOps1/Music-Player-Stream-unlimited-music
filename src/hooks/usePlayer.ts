import { useState, useEffect, useCallback, useRef } from 'react';
import type { Song, PlayerState } from '@/types';
import { YouTubePlayer, PlayerState as YTState, loadYouTubeAPI } from '@/utils/youtubePlayer';
import { loadCachedSong, revokeObjectURL } from '@/utils/audioCache';
import { useAudioVisualizer } from './useAudioVisualizer';

interface UsePlayerReturn {
  playerState: PlayerState;
  currentSong: Song | null;
  isPlaying: boolean;
  playSong: (song: Song, queue?: Song[]) => Promise<void>;
  pause: () => void;
  resume: () => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  seekForward: () => void;
  seekBackward: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setRepeatMode: (mode: 'none' | 'one' | 'all') => void;
  toggleShuffle: () => void;
  next: () => void;
  previous: () => void;
  setFullscreen: (fullscreen: boolean) => void;
  audioUrl: string | null;
  cleanup: () => void;
}

export function usePlayer(queue: Song[] = []): UsePlayerReturn {
  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: false,
    isPaused: true,
    currentTime: 0,
    duration: 0,
    volume: 75,
    isMuted: false,
    repeatMode: 'none',
    isShuffle: false,
    isFullscreen: false,
  });

  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [useCachedAudio, setUseCachedAudio] = useState(false);

  const playerIntervalRef = useRef<number | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const currentIndexRef = useRef<number>(-1);

  // --- Refs to prevent Stale Closures ---
  const queueRef = useRef(queue);
  const playerStateRef = useRef(playerState);
  const currentSongRef = useRef(currentSong);
  const useCachedAudioRef = useRef(useCachedAudio);
  const playSongRef = useRef<((song: Song, queue?: Song[]) => Promise<void>) | null>(null);

  const { startVisualizer, stopVisualizer } = useAudioVisualizer();

  // Keep refs updated with latest values
  useEffect(() => { queueRef.current = queue; }, [queue]);
  useEffect(() => { playerStateRef.current = playerState; }, [playerState]);
  useEffect(() => { currentSongRef.current = currentSong; }, [currentSong]);
  useEffect(() => { useCachedAudioRef.current = useCachedAudio; }, [useCachedAudio]);

  // Initialize YouTube API
  useEffect(() => {
    loadYouTubeAPI().catch(console.error);
    return () => {
      if (playerIntervalRef.current) {
        window.clearInterval(playerIntervalRef.current);
      }
    };
  }, []);

  // Update queue index when queue changes
  useEffect(() => {
    if (currentSong && queue.length > 0) {
      const index = queue.findIndex((s) => s.videoId === currentSong.videoId);
      if (index !== -1) {
        currentIndexRef.current = index;
      }
    }
  }, [queue, currentSong]);

  // Handle song end (using refs to avoid stale closures)
  const handleSongEnd = useCallback(() => {
    const { repeatMode } = playerStateRef.current;
    const songQueue = queueRef.current;
    const song = currentSongRef.current;

    if (repeatMode === 'one') {
      if (song && playSongRef.current) {
        playSongRef.current(song, songQueue);
      }
      return;
    }

    const currentIndex = songQueue.findIndex((s) => s.videoId === song?.videoId);

    if (repeatMode === 'all' && songQueue.length > 0) {
      const nextIdx = (currentIndex + 1) % songQueue.length;
      if (playSongRef.current) playSongRef.current(songQueue[nextIdx], songQueue);
      return;
    }

    if (currentIndex !== -1 && currentIndex < songQueue.length - 1) {
      if (playSongRef.current) playSongRef.current(songQueue[currentIndex + 1], songQueue);
    } else {
      // Stop playing if queue is finished and no repeat
      setPlayerState(prev => ({ ...prev, isPlaying: false, isPaused: true }));
    }
  }, []);

  // Update player state from YouTube player (polled via interval)
  const updatePlayerState = useCallback(() => {
    const ytPlayer = YouTubePlayer.getPlayer();
    if (!ytPlayer) return;

    try {
      const state = ytPlayer.getPlayerState();
      const isPlaying = state === YTState.PLAYING;
      const currentTime = ytPlayer.getCurrentTime() || 0;
      const duration = ytPlayer.getDuration() || 0;

      setPlayerState((prev) => ({
        ...prev,
        isPlaying,
        isPaused: state === YTState.PAUSED,
        currentTime,
        duration,
      }));

      if (state === YTState.ENDED) {
        handleSongEnd();
      }
    } catch (error) {
      console.error('Error fetching YT player state:', error);
    }
  }, [handleSongEnd]);

  // Start/Stop player state polling
  useEffect(() => {
    const updateRef = updatePlayerState; // capture latest
    
    if (playerState.isPlaying) {
      playerIntervalRef.current = window.setInterval(updateRef, 500);
    } else {
      if (playerIntervalRef.current) {
        window.clearInterval(playerIntervalRef.current);
        playerIntervalRef.current = null;
      }
    }

    return () => {
      if (playerIntervalRef.current) {
        window.clearInterval(playerIntervalRef.current);
      }
    };
  }, [playerState.isPlaying, updatePlayerState]);

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    if (playerIntervalRef.current) {
      window.clearInterval(playerIntervalRef.current);
      playerIntervalRef.current = null;
    }
    if (audioUrl) {
      revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current = null;
    }
    stopVisualizer();
  }, [audioUrl, stopVisualizer]);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  // Play song function
  const playSong = useCallback(async (song: Song, songQueue: Song[] = []) => {
    try {
      // Cleanup previous audio
      if (audioUrl) {
        revokeObjectURL(audioUrl);
      }
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current.removeEventListener('ended', handleSongEnd);
        audioElementRef.current = null;
      }
      stopVisualizer();

      // Check if song is cached
      const cachedSong = await loadCachedSong(song.videoId);
      
      if (cachedSong) {
        setUseCachedAudio(true);
        const blobUrl = URL.createObjectURL(cachedSong.blob);
        setAudioUrl(blobUrl);

        const audio = new Audio(blobUrl);
        audioElementRef.current = audio;

        audio.addEventListener('ended', handleSongEnd);
        audio.addEventListener('timeupdate', () => {
          setPlayerState((prev) => ({
            ...prev,
            currentTime: audio.currentTime,
            duration: audio.duration || 0,
          }));
        });

        audio.volume = playerStateRef.current.volume / 100;
        audio.play();
        startVisualizer(audio);
      } else {
        setUseCachedAudio(false);
        setAudioUrl(null);

        // Play via YouTube safely
        try {
          YouTubePlayer.loadVideo(song.videoId);
        } catch (err) {
          console.error('YouTube Player load error:', err);
        }
      }

      setCurrentSong(song);
      currentIndexRef.current = songQueue.findIndex((s) => s.videoId === song.videoId);

      setPlayerState((prev) => ({
        ...prev,
        isPlaying: true,
        isPaused: false,
        currentTime: 0,
        duration: song.durationSeconds || 0,
      }));
    } catch (error) {
      console.error('Error playing song:', error);
    }
  }, [audioUrl, handleSongEnd, startVisualizer, stopVisualizer]);

  // Keep playSong ref updated
  useEffect(() => { playSongRef.current = playSong; }, [playSong]);

  const pause = useCallback(() => {
    if (useCachedAudioRef.current && audioElementRef.current) {
      audioElementRef.current.pause();
    } else {
      try { YouTubePlayer.pause(); } catch (e) { console.error(e); }
    }
    stopVisualizer();
    setPlayerState((prev) => ({ ...prev, isPlaying: false, isPaused: true }));
  }, [stopVisualizer]);

  const resume = useCallback(() => {
    if (useCachedAudioRef.current && audioElementRef.current) {
      audioElementRef.current.play();
      startVisualizer(audioElementRef.current);
    } else {
      try { YouTubePlayer.play(); } catch (e) { console.error(e); }
    }
    setPlayerState((prev) => ({ ...prev, isPlaying: true, isPaused: false }));
  }, [startVisualizer]);

  const togglePlay = useCallback(() => {
    if (playerStateRef.current.isPlaying) {
      pause();
    } else {
      resume();
    }
  }, [pause, resume]);

  const seek = useCallback((time: number) => {
    if (useCachedAudioRef.current && audioElementRef.current) {
      audioElementRef.current.currentTime = time;
    } else {
      try { YouTubePlayer.seekTo(time); } catch (e) { console.error(e); }
    }
    setPlayerState((prev) => ({ ...prev, currentTime: time }));
  }, []);

  const seekForward = useCallback(() => {
    const { currentTime, duration } = playerStateRef.current;
    const newTime = Math.min(currentTime + 10, duration);
    seek(newTime);
  }, [seek]);

  const seekBackward = useCallback(() => {
    const { currentTime } = playerStateRef.current;
    const newTime = Math.max(currentTime - 10, 0);
    seek(newTime);
  }, [seek]);

  const setVolume = useCallback((volume: number) => {
    try { YouTubePlayer.setVolume(volume); } catch (e) {}
    if (audioElementRef.current) {
      audioElementRef.current.volume = volume / 100;
    }
    setPlayerState((prev) => ({ ...prev, volume, isMuted: volume === 0 }));
  }, []);

  const toggleMute = useCallback(() => {
    const isMuted = !playerStateRef.current.isMuted;
    if (isMuted) {
      try { YouTubePlayer.mute(); } catch (e) {}
    } else {
      try { YouTubePlayer.unMute(); } catch (e) {}
    }
    setPlayerState((prev) => ({ ...prev, isMuted }));
  }, []);

  const setRepeatMode = useCallback((mode: 'none' | 'one' | 'all') => {
    setPlayerState((prev) => ({ ...prev, repeatMode: mode }));
  }, []);

  const toggleShuffle = useCallback(() => {
    setPlayerState((prev) => ({ ...prev, isShuffle: !prev.isShuffle }));
  }, []);

  const next = useCallback(() => {
    const songQueue = queueRef.current;
    if (songQueue.length === 0) return;

    const currentIndex = currentIndexRef.current;
    let nextIndex: number;

    if (playerStateRef.current.isShuffle) {
      nextIndex = Math.floor(Math.random() * songQueue.length);
    } else {
      nextIndex = currentIndex + 1;
      if (nextIndex >= songQueue.length) {
        nextIndex = playerStateRef.current.repeatMode === 'all' ? 0 : -1;
      }
    }

    if (nextIndex !== -1 && songQueue[nextIndex] && playSongRef.current) {
      playSongRef.current(songQueue[nextIndex], songQueue);
    }
  }, []);

  const previous = useCallback(() => {
    const songQueue = queueRef.current;
    if (songQueue.length === 0) return;

    const currentIndex = currentIndexRef.current;
    let prevIndex: number;

    if (playerStateRef.current.isShuffle) {
      prevIndex = Math.floor(Math.random() * songQueue.length);
    } else {
      prevIndex = currentIndex - 1;
      if (prevIndex < 0) {
        prevIndex = playerStateRef.current.repeatMode === 'all' ? songQueue.length - 1 : -1;
      }
    }

    if (prevIndex !== -1 && songQueue[prevIndex] && playSongRef.current) {
      playSongRef.current(songQueue[prevIndex], songQueue);
    }
  }, []);

  const setFullscreen = useCallback((fullscreen: boolean) => {
    setPlayerState((prev) => ({ ...prev, isFullscreen: fullscreen }));
  }, []);

  return {
    playerState,
    currentSong,
    isPlaying: playerState.isPlaying,
    playSong,
    pause,
    resume,
    togglePlay,
    seek,
    seekForward,
    seekBackward,
    setVolume,
    toggleMute,
    setRepeatMode,
    toggleShuffle,
    next,
    previous,
    setFullscreen,
    audioUrl,
    cleanup,
  };
}
