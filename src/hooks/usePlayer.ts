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

  const { startVisualizer, stopVisualizer } = useAudioVisualizer();

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

  // Handle song end
  const handleSongEnd = useCallback(
    (songQueue: Song[]) => {
      const { repeatMode } = playerState;

      if (repeatMode === 'one') {
        if (currentSong) {
          playSong(currentSong, songQueue);
        }
        return;
      }

      if (repeatMode === 'all' && songQueue.length > 0) {
        playSong(songQueue[0], songQueue);
        return;
      }

      const currentIndex = currentIndexRef.current;
      if (currentIndex !== -1 && currentIndex < songQueue.length - 1) {
        playSong(songQueue[currentIndex + 1], songQueue);
      }
    },
    [playerState.repeatMode, currentSong]
  );

  // Update player state from YouTube player
  const updatePlayerState = useCallback(() => {
    const ytPlayer = YouTubePlayer.getPlayer();
    if (!ytPlayer) return;

    const state = ytPlayer.getPlayerState();
    const isPlaying = state === YTState.PLAYING;
    const currentTime = ytPlayer.getCurrentTime();
    const duration = ytPlayer.getDuration();

    setPlayerState((prev) => ({
      ...prev,
      isPlaying,
      isPaused: state === YTState.PAUSED,
      currentTime,
      duration,
    }));

    if (state === YTState.ENDED && currentSong) {
      handleSongEnd(queue);
    }
  }, [currentSong, queue, handleSongEnd]);

  // Start player state polling
  useEffect(() => {
    if (playerState.isPlaying) {
      playerIntervalRef.current = window.setInterval(updatePlayerState, 500);
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

  // Play song function
  const playSong = useCallback(async (song: Song, songQueue: Song[] = []) => {
    try {
      // Cleanup previous audio
      if (audioUrl) {
        revokeObjectURL(audioUrl);
      }
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current = null;
      }

      // Check if song is cached
      const cachedSong = await loadCachedSong(song.videoId);
      
      if (cachedSong) {
        setUseCachedAudio(true);
        const blobUrl = URL.createObjectURL(cachedSong.blob);
        setAudioUrl(blobUrl);

        // Create audio element for cached audio
        const audio = new Audio(blobUrl);
        audioElementRef.current = audio;

        audio.addEventListener('ended', () => handleSongEnd(songQueue));
        audio.addEventListener('timeupdate', () => {
          setPlayerState((prev) => ({
            ...prev,
            currentTime: audio.currentTime,
            duration: audio.duration || 0,
          }));
        });

        audio.play();
        startVisualizer(audio);
      } else {
        setUseCachedAudio(false);
        setAudioUrl(null);

        // Play via YouTube
        YouTubePlayer.loadVideo(song.videoId);
      }

      setCurrentSong(song);
      currentIndexRef.current = songQueue.findIndex((s) => s.videoId === song.videoId);

      setPlayerState((prev) => ({
        ...prev,
        isPlaying: true,
        isPaused: false,
        currentTime: 0,
        duration: song.durationSeconds,
      }));
    } catch (error) {
      console.error('Error playing song:', error);
    }
  }, [audioUrl, handleSongEnd, startVisualizer]);

  const pause = useCallback(() => {
    if (useCachedAudio && audioElementRef.current) {
      audioElementRef.current.pause();
      stopVisualizer();
    } else {
      YouTubePlayer.pause();
    }
    setPlayerState((prev) => ({ ...prev, isPlaying: false, isPaused: true }));
  }, [useCachedAudio, audioElementRef, stopVisualizer]);

  const resume = useCallback(() => {
    if (useCachedAudio && audioElementRef.current) {
      audioElementRef.current.play();
      startVisualizer(audioElementRef.current);
    } else {
      YouTubePlayer.play();
    }
    setPlayerState((prev) => ({ ...prev, isPlaying: true, isPaused: false }));
  }, [useCachedAudio, audioElementRef, startVisualizer]);

  const togglePlay = useCallback(() => {
    if (playerState.isPlaying) {
      pause();
    } else {
      resume();
    }
  }, [playerState.isPlaying, pause, resume]);

  const seek = useCallback((time: number) => {
    if (useCachedAudio && audioElementRef.current) {
      audioElementRef.current.currentTime = time;
    } else {
      YouTubePlayer.seekTo(time);
    }
    setPlayerState((prev) => ({ ...prev, currentTime: time }));
  }, [useCachedAudio, audioElementRef]);

  const seekForward = useCallback(() => {
    const newTime = Math.min(playerState.currentTime + 10, playerState.duration);
    seek(newTime);
  }, [playerState.currentTime, playerState.duration, seek]);

  const seekBackward = useCallback(() => {
    const newTime = Math.max(playerState.currentTime - 10, 0);
    seek(newTime);
  }, [playerState.currentTime, seek]);

  const setVolume = useCallback((volume: number) => {
    YouTubePlayer.setVolume(volume);
    setPlayerState((prev) => ({ ...prev, volume, isMuted: volume === 0 }));
  }, []);

  const toggleMute = useCallback(() => {
    if (playerState.isMuted) {
      YouTubePlayer.unMute();
    } else {
      YouTubePlayer.mute();
    }
    setPlayerState((prev) => ({ ...prev, isMuted: !prev.isMuted }));
  }, [playerState.isMuted]);

  const setRepeatMode = useCallback((mode: 'none' | 'one' | 'all') => {
    setPlayerState((prev) => ({ ...prev, repeatMode: mode }));
  }, []);

  const toggleShuffle = useCallback(() => {
    setPlayerState((prev) => ({ ...prev, isShuffle: !prev.isShuffle }));
  }, []);

  const next = useCallback(() => {
    if (queue.length === 0) return;

    const currentIndex = currentIndexRef.current;
    let nextIndex: number;

    if (playerState.isShuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = currentIndex + 1;
      if (nextIndex >= queue.length) {
        nextIndex = playerState.repeatMode === 'all' ? 0 : -1;
      }
    }

    if (nextIndex !== -1 && queue[nextIndex]) {
      playSong(queue[nextIndex], queue);
    }
  }, [queue, playerState.isShuffle, playerState.repeatMode, playSong]);

  const previous = useCallback(() => {
    if (queue.length === 0) return;

    const currentIndex = currentIndexRef.current;
    let prevIndex: number;

    if (playerState.isShuffle) {
      prevIndex = Math.floor(Math.random() * queue.length);
    } else {
      prevIndex = currentIndex - 1;
      if (prevIndex < 0) {
        prevIndex = playerState.repeatMode === 'all' ? queue.length - 1 : -1;
      }
    }

    if (prevIndex !== -1 && queue[prevIndex]) {
      playSong(queue[prevIndex], queue);
    }
  }, [queue, playerState.isShuffle, playerState.repeatMode, playSong]);

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
