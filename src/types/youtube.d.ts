// YouTube IFrame API Types
declare namespace YT {
  interface Player {
    destroy(): void;
    loadVideoById(videoId: string, startSeconds?: number, endSeconds?: number): void;
    cueVideoById(videoId: string, startSeconds?: number, endSeconds?: number): void;
    cueVideoById(options: { videoId: string; startSeconds?: number; endSeconds?: number; suggestedQuality?: string }): void;
    playVideo(): void;
    pauseVideo(): void;
    stopVideo(): void;
    seekTo(seconds: number, allowSeekAhead: boolean): void;
    setVolume(volume: number): void;
    getVolume(): number;
    mute(): void;
    unMute(): void;
    isMuted(): boolean;
    getCurrentTime(): number;
    getDuration(): number;
    getPlayerState(): number;
    getPlaybackRate(): number;
    setPlaybackRate(rate: number): void;
    getAvailablePlaybackRates(): number[];
    getVideoLoadedFraction(): number;
    getVideoUrl(): string;
    getVideoEmbedCode(): string;
    setLoop(loopPlaylists: boolean): void;
    setPlaylist(playlistId: string, index?: number, startSeconds?: number, suggestedQuality?: string): void;
    setPlaylist(videoIds: string[], index?: number, startSeconds?: number, suggestedQuality?: string): void;
    previousVideo(): void;
    nextVideo(): void;
  }

  interface PlayerOptions {
    height?: string | number;
    width?: string | number;
    videoId?: string;
    playerVars?: PlayerVars;
    events?: {
      onReady?: (event: OnReadyEvent) => void;
      onStateChange?: (event: OnStateChangeEvent) => void;
      onPlaybackQualityChange?: (event: OnPlaybackQualityChangeEvent) => void;
      onPlaybackRateChange?: (event: OnPlaybackRateChangeEvent) => void;
      onError?: (event: OnErrorEvent) => void;
      onApiChange?: (event: Event) => void;
    };
  }

  interface PlayerVars {
    autoplay?: number;
    cc_load_policy?: number;
    color?: string;
    controls?: number;
    disablekb?: number;
    enablejsapi?: number;
    end?: number;
    fs?: number;
    hl?: string;
    iv_load_policy?: number;
    list?: string;
    listType?: string;
    loop?: number;
    modestbranding?: number;
    origin?: string;
    playlist?: string;
    playsinline?: number;
    rel?: number;
    showinfo?: number;
    start?: number;
    widget_referrer?: string;
  }

  interface OnReadyEvent {
    target: Player;
  }

  interface OnStateChangeEvent {
    target: Player;
    data: number;
  }

  interface OnPlaybackQualityChangeEvent {
    target: Player;
    data: string;
  }

  interface OnPlaybackRateChangeEvent {
    target: Player;
    data: number;
  }

  interface OnErrorEvent {
    target: Player;
    data: number;
  }

  interface Event {
    target: Player;
  }

  class Player {
    constructor(containerId: string | HTMLElement, options: PlayerOptions);
    destroy(): void;
    loadVideoById(videoId: string, startSeconds?: number, endSeconds?: number): void;
    cueVideoById(videoId: string, startSeconds?: number, endSeconds?: number): void;
    cueVideoById(options: { videoId: string; startSeconds?: number; endSeconds?: number; suggestedQuality?: string }): void;
    playVideo(): void;
    pauseVideo(): void;
    stopVideo(): void;
    seekTo(seconds: number, allowSeekAhead: boolean): void;
    setVolume(volume: number): void;
    getVolume(): number;
    mute(): void;
    unMute(): void;
    isMuted(): boolean;
    getCurrentTime(): number;
    getDuration(): number;
    getPlayerState(): number;
    getPlaybackRate(): number;
    setPlaybackRate(rate: number): void;
    getAvailablePlaybackRates(): number[];
    getVideoLoadedFraction(): number;
    getVideoUrl(): string;
    getVideoEmbedCode(): string;
    setLoop(loopPlaylists: boolean): void;
    setPlaylist(playlistId: string, index?: number, startSeconds?: number, suggestedQuality?: string): void;
    setPlaylist(videoIds: string[], index?: number, startSeconds?: number, suggestedQuality?: string): void;
    previousVideo(): void;
    nextVideo(): void;
  }
}

declare interface Window {
  onYouTubeIframeAPIReady?: () => void;
  YT?: {
    Player: typeof YT.Player;
  };
}
