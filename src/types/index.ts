export interface Song {
  videoId: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration: string;
  durationSeconds: number;
  isCached?: boolean;
}

export interface QueueItem extends Song {
  queueId: string;
}

export interface PlayerState {
  isPlaying: boolean;
  isPaused: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  repeatMode: 'none' | 'one' | 'all';
  isShuffle: boolean;
  isFullscreen: boolean;
}

export interface SearchProvider {
  name: string;
  id: 'invidious' | 'piped' | 'youtube';
}

export interface Settings {
  apiKey: string;
  preferredProvider: SearchProvider['id'];
  darkMode: boolean;
  autoCache: boolean;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface Artist {
  name: string;
  imageUrl: string;
  genre: string;
}

export interface CachedSong {
  videoId: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration: string;
  durationSeconds: number;
  blob: Blob;
  cachedAt: number;
}

export interface SearchResult {
  songs: Song[];
  provider: string;
}
