// YouTube IFrame API loader and wrapper
let player: YT.Player | null = null;
let playerReady = false;
let playerReadyCallbacks: Array<(player: YT.Player) => void> = [];
let apiLoaded = false;

interface YouTubePlayerCallbacks {
  onReady?: (event: YT.OnReadyEvent) => void;
  onStateChange?: (event: YT.OnStateChangeEvent) => void;
  onPlaybackQualityChange?: (event: YT.OnPlaybackQualityChangeEvent) => void;
  onPlaybackRateChange?: (event: YT.OnPlaybackRateChangeEvent) => void;
  onError?: (event: YT.OnErrorEvent) => void;
  onApiChange?: () => void;
}

// Load YouTube IFrame API
export function loadYouTubeAPI(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (apiLoaded) {
      resolve();
      return;
    }

    // Check if API is already loaded
    if (typeof YT !== 'undefined' && typeof YT.Player !== 'undefined') {
      apiLoaded = true;
      resolve();
      return;
    }

    // Load script
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Set up callback
    (window as any).onYouTubeIframeAPIReady = () => {
      apiLoaded = true;
      resolve();
    };

    // Timeout after 10 seconds
    setTimeout(() => {
      if (!apiLoaded) {
        reject(new Error('Failed to load YouTube API'));
      }
    }, 10000);
  });
}

// Initialize YouTube player
export function initYouTubePlayer(
  containerId: string,
  callbacks: YouTubePlayerCallbacks = {}
): Promise<YT.Player> {
  return new Promise((resolve, reject) => {
    loadYouTubeAPI()
      .then(() => {
        if (!player) {
          player = new YT.Player(containerId, {
            height: '360',
            width: '640',
            videoId: '',
            playerVars: {
              autoplay: 0,
              controls: 0,
              disablekb: 1,
              fs: 0,
              modestbranding: 1,
              rel: 0,
              showinfo: 0,
              iv_load_policy: 3,
            },
            events: {
              onReady: (event: YT.OnReadyEvent) => {
                playerReady = true;
                callbacks.onReady?.(event);
                resolve(event.target);
                // Notify waiting callbacks
                playerReadyCallbacks.forEach(cb => cb(event.target));
                playerReadyCallbacks = [];
              },
              onStateChange: callbacks.onStateChange,
              onPlaybackQualityChange: callbacks.onPlaybackQualityChange,
              onPlaybackRateChange: callbacks.onPlaybackRateChange,
              onError: callbacks.onError,
              onApiChange: callbacks.onApiChange,
            },
          });
        } else {
          resolve(player);
        }
      })
      .catch(reject);
  });
}

// Get player instance
export function getPlayer(): YT.Player | null {
  return player;
}

// Check if player is ready
export function isPlayerReady(): boolean {
  return playerReady;
}

// Wait for player to be ready
export function waitForPlayer(): Promise<YT.Player> {
  return new Promise((resolve) => {
    if (player && playerReady) {
      resolve(player);
    } else {
      playerReadyCallbacks.push(resolve);
    }
  });
}

// Player control functions
export const YouTubePlayer = {
  // Get player instance
  getPlayer(): YT.Player | null {
    return player;
  },

  // Load a video
  loadVideo(videoId: string): void {
    if (player && playerReady) {
      player.loadVideoById(videoId);
    }
  },

  // Play video
  play(): void {
    if (player && playerReady) {
      player.playVideo();
    }
  },

  // Pause video
  pause(): void {
    if (player && playerReady) {
      player.pauseVideo();
    }
  },

  // Stop video
  stop(): void {
    if (player && playerReady) {
      player.stopVideo();
    }
  },

  // Seek to position
  seekTo(seconds: number, allowSeekAhead: boolean = true): void {
    if (player && playerReady) {
      player.seekTo(seconds, allowSeekAhead);
    }
  },

  // Set volume (0-100)
  setVolume(volume: number): void {
    if (player && playerReady) {
      player.setVolume(Math.max(0, Math.min(100, volume)));
    }
  },

  // Get current volume
  getVolume(): number {
    return player?.getVolume() ?? 0;
  },

  // Mute
  mute(): void {
    if (player && playerReady) {
      player.mute();
    }
  },

  // Unmute
  unMute(): void {
    if (player && playerReady) {
      player.unMute();
    }
  },

  // Check if muted
  isMuted(): boolean {
    return player?.isMuted() ?? false;
  },

  // Get current time
  getCurrentTime(): number {
    return player?.getCurrentTime() ?? 0;
  },

  // Get duration
  getDuration(): number {
    return player?.getDuration() ?? 0;
  },

  // Get playback state
  getState(): number {
    return player?.getPlayerState() ?? -1;
  },

  // Get playback rate
  getPlaybackRate(): number {
    return player?.getPlaybackRate() ?? 1;
  },

  // Set playback rate
  setPlaybackRate(rate: number): void {
    if (player && playerReady) {
      player.setPlaybackRate(rate);
    }
  },

  // Get available playback rates
  getAvailablePlaybackRates(): number[] {
    return player?.getAvailablePlaybackRates() ?? [1];
  },

  // Get buffered percentage
  getVideoLoadedFraction(): number {
    return player?.getVideoLoadedFraction() ?? 0;
  },

  // Set loop
  setLoop(loop: boolean): void {
    if (player && playerReady) {
      player.setLoop(loop);
    }
  },

  // Set playlist
  setPlaylist(videoIds: string[], index: number = 0): void {
    if (player && playerReady) {
      player.setPlaylist(videoIds, index);
    }
  },

  // Previous video
  previousVideo(): void {
    if (player && playerReady) {
      player.previousVideo();
    }
  },

  // Next video
  nextVideo(): void {
    if (player && playerReady) {
      player.nextVideo();
    }
  },

  // Cue video (prepare without playing)
  cueVideo(videoId: string, startSeconds?: number): void {
    if (player && playerReady) {
      player.cueVideoById({
        videoId,
        startSeconds,
      });
    }
  },

  // Destroy player
  destroy(): void {
    if (player) {
      player.destroy();
      player = null;
      playerReady = false;
    }
  },
};

// Player state constants (from YouTube API)
export const PlayerState = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5,
};

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  YouTubePlayer.destroy();
});
