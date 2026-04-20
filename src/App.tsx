import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Search, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, 
  Settings, Music, Shuffle, Repeat, ListMusic, X, Moon, Sun, 
  Heart, Clock, TrendingUp, Radio
} from 'lucide-react';
import type { Song, Toast } from '@/types';
import { searchSongs, clearSearchCache } from '@/utils/api';
import { usePlayer } from '@/hooks/usePlayer';
import { useQueue } from '@/hooks/useQueue';
import { useOfflineCache } from '@/hooks/useOfflineCache';
import { POPULAR_ARTISTS, TRENDING_SEARCHES, MOODS } from '@/data/artists';
import { initYouTubePlayer, PlayerState as YTPlayerState } from '@/utils/youtubePlayer';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [darkMode, setDarkMode] = useState(true);
  const [provider, setProvider] = useState<'invidious' | 'piped' | 'youtube'>('piped');
  const [apiKey, setApiKey] = useState('');
  const [showQueue, setShowQueue] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');
  const [recentlyPlayed, setRecentlyPlayed] = useState<Song[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isPlayerInitialized, setIsPlayerInitialized] = useState(false);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  const { cachedSongs, handleClearCache } = useOfflineCache();
  const { queue, addToQueue, removeFromQueue, clearQueue } = useQueue();
  const player = usePlayer(queue);

  // Ref to always keep the latest player instance for callbacks/events
  const playerRef = useRef(player);
  useEffect(() => {
    playerRef.current = player;
  }, [player]);

  // Load settings from localStorage
  useEffect(() => {
    const savedApiKey = localStorage.getItem('youtubeApiKey') || '';
    const savedProvider = (localStorage.getItem('preferredProvider') || 'piped') as 'invidious' | 'piped' | 'youtube';
    const savedDarkMode = localStorage.getItem('darkMode') !== 'false';
    const savedRecent = localStorage.getItem('recentlyPlayed');
    const savedFavorites = localStorage.getItem('favorites');
    
    setApiKey(savedApiKey);
    setTempApiKey(savedApiKey);
    setProvider(savedProvider);
    setDarkMode(savedDarkMode);
    
    if (savedRecent) {
      try {
        setRecentlyPlayed(JSON.parse(savedRecent));
      } catch {}
    }
    
    if (savedFavorites) {
      try {
        setFavorites(new Set(JSON.parse(savedFavorites)));
      } catch {}
    }
  }, []);

  // Initialize YouTube player (with delay to ensure DOM is ready)
  useEffect(() => {
    const initPlayer = async () => {
      try {
        await initYouTubePlayer('youtube-player', {
          onReady: () => {
            console.log('YouTube player ready');
            setIsPlayerInitialized(true);
          },
          onStateChange: (event) => {
            if (event.data === YTPlayerState.ENDED) {
              // Use ref to avoid stale closure bug
              playerRef.current.next();
            }
          },
          onError: (event) => {
            console.error('YouTube player error:', event.data);
            addToast('Playback error. Try another song.', 'error');
          }
        });
      } catch (error) {
        console.error('Failed to init player:', error);
      }
    };
    
    // Small delay ensures the DOM container is fully mounted
    const timer = setTimeout(initPlayer, 500);
    return () => clearTimeout(timer);
  }, []);

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await searchSongs(searchQuery, apiKey, provider);

      if (result.songs.length === 0) {
        setError('No songs found. Try a different search term.');
        setSearchResults([]);
      } else {
        setSearchResults(result.songs);
        addToast(`Found ${result.songs.length} songs via ${result.provider}`, 'success');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Search failed. Please check your internet connection.');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addToRecentlyPlayed = (song: Song) => {
    setRecentlyPlayed(prev => {
      const filtered = prev.filter(s => s.videoId !== song.videoId);
      const updated = [song, ...filtered].slice(0, 20);
      localStorage.setItem('recentlyPlayed', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleFavorite = useCallback((song: Song) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(song.videoId)) {
        newSet.delete(song.videoId);
        addToast('Removed from favorites', 'info');
      } else {
        newSet.add(song.videoId);
        addToast('Added to favorites', 'success');
      }
      localStorage.setItem('favorites', JSON.stringify([...newSet]));
      return newSet;
    });
  }, [addToast]);

  // Ref for toggleFavorite to prevent re-renders in keyboard hook
  const toggleFavoriteRef = useRef(toggleFavorite);
  useEffect(() => {
    toggleFavoriteRef.current = toggleFavorite;
  }, [toggleFavorite]);

  const handlePlaySong = (song: Song) => {
    addToRecentlyPlayed(song);
    if (!queue.some(s => s.videoId === song.videoId)) {
      addToQueue(song);
    }
    playerRef.current.playSong(song, [...queue, song]);
    addToast(`Playing: ${song.title}`, 'success');
  };

  const handleAddToQueue = (song: Song) => {
    if (!queue.some(s => s.videoId === song.videoId)) {
      addToQueue(song);
      addToast(`Added to queue: ${song.title}`, 'success');
    } else {
      addToast('Song already in queue', 'info');
    }
  };

  const handleQuickSearch = async (query: string) => {
    setSearchQuery(query);
    setIsLoading(true);
    setError(null);
    try {
      const result = await searchSongs(query, apiKey, provider);
      setSearchResults(result.songs);
      if (result.songs.length === 0) {
        setError(`No songs found for "${query}"`);
      } else {
        addToast(`Found ${result.songs.length} songs`, 'success');
      }
    } catch (err) {
      console.error('Quick search error:', err);
      setError(`Failed to search for "${query}"`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleArtistClick = async (artistName: string) => {
    await handleQuickSearch(artistName + ' songs');
  };

  const handleMoodClick = async (query: string) => {
    await handleQuickSearch(query);
  };

  const handleSaveApiKey = () => {
    localStorage.setItem('youtubeApiKey', tempApiKey);
    setApiKey(tempApiKey);
    addToast('API key saved!', 'success');
    setShowSettings(false);
  };

  const handleSaveProvider = (newProvider: 'invidious' | 'piped' | 'youtube') => {
    localStorage.setItem('preferredProvider', newProvider);
    setProvider(newProvider);
    addToast(`Switched to ${newProvider}`, 'success');
  };

  const handleToggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
  };

  // Keyboard shortcuts (bound only once using refs)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const p = playerRef.current;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          p.togglePlay();
          break;
        case 'KeyK':
          p.togglePlay();
          break;
        case 'ArrowRight':
          if (e.shiftKey) {
            p.seekForward();
          }
          break;
        case 'ArrowLeft':
          if (e.shiftKey) {
            p.seekBackward();
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          p.setVolume(Math.min(100, p.playerState.volume + 10));
          break;
        case 'ArrowDown':
          e.preventDefault();
          p.setVolume(Math.max(0, p.playerState.volume - 10));
          break;
        case 'KeyM':
          p.toggleMute();
          break;
        case 'KeyN':
          p.next();
          break;
        case 'KeyP':
          p.previous();
          break;
        case 'KeyS':
          p.toggleShuffle();
          break;
        case 'KeyR':
          const modes: Array<'none' | 'one' | 'all'> = ['none', 'one', 'all'];
          const currentIndex = modes.indexOf(p.playerState.repeatMode);
          p.setRepeatMode(modes[(currentIndex + 1) % modes.length]);
          break;
        case 'KeyF':
          if (p.currentSong) {
            toggleFavoriteRef.current(p.currentSong);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []); // Empty dependency ensures it doesn't re-bind and cause bugs

  const themeClasses = darkMode
    ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white'
    : 'bg-gradient-to-br from-gray-50 via-purple-50 to-gray-100 text-gray-900';

  const cardClasses = darkMode
    ? 'bg-white/10 backdrop-blur-lg border-white/20'
    : 'bg-white/70 backdrop-blur-lg border-gray-200';

  const progressPercent = player.playerState.duration 
    ? (player.playerState.currentTime / player.playerState.duration) * 100 
    : 0;

  return (
    <div className={`min-h-screen ${themeClasses} transition-colors duration-300`}>
      {/* YouTube Player Container (Safely hidden off-screen) */}
      <div 
        ref={playerContainerRef}
        id="youtube-player" 
        className="fixed pointer-events-none"
        style={{ top: '-9999px', left: '-9999px', width: '1px', height: '1px' }}
        aria-hidden="true"
      />

      {/* Header */}
      <header className={`${cardClasses} border-b sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-violet-500 to-pink-500 rounded-xl shadow-lg">
              <Radio className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                🎵 Music Player
              </h1>
              <p className="text-xs text-gray-400">Stream unlimited music</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className={`text-xs px-2 py-1 rounded-full ${isPlayerInitialized ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
              {isPlayerInitialized ? '● Ready' : '○ Loading...'}
            </div>
            <button
              onClick={handleToggleDarkMode}
              className={`p-2 rounded-lg ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-200'} transition-colors`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className={`p-2 rounded-lg ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-200'} transition-colors`}
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 pb-48">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className={`flex gap-3 p-2 rounded-2xl ${cardClasses} border shadow-lg`}>
            <Search className="w-6 h-6 ml-3 text-violet-400 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for songs, artists, albums..."
              className={`flex-1 bg-transparent outline-none px-3 py-2 ${darkMode ? 'placeholder-white/50' : 'placeholder-gray-400'}`}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg"
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-gray-500">Provider: <span className="font-semibold text-violet-400">{provider}</span></p>
            <p className="text-xs text-gray-500">
              Shortcuts: Space=Play/Pause, N=Next, P=Prev, M=Mute
            </p>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400">
            <p className="font-medium">⚠️ {error}</p>
            <p className="text-xs mt-2">Try different keywords or switch provider in Settings</p>
          </div>
        )}

        {/* Mood Browsing */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Music className="w-5 h-5 text-violet-400" />
            🎭 Browse by Mood
          </h2>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {MOODS.map((mood) => (
              <button
                key={mood.id}
                onClick={() => handleMoodClick(mood.query)}
                className={`flex-shrink-0 px-4 py-2 rounded-full ${cardClasses} border hover:border-violet-500/50 transition-all hover:scale-105 text-sm font-medium`}
              >
                {mood.name}
              </button>
            ))}
          </div>
        </section>

        {/* Popular Artists */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Music className="w-5 h-5 text-violet-400" />
              🎤 Popular Artists
            </h2>
            <span className="text-xs text-gray-400">{POPULAR_ARTISTS.length} artists</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {POPULAR_ARTISTS.map((artist) => (
              <button
                key={artist.id}
                onClick={() => handleArtistClick(artist.name)}
                className={`p-3 rounded-xl ${cardClasses} border text-center hover:border-violet-500/50 transition-all hover:scale-105 group`}
              >
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-16 h-16 rounded-full mx-auto mb-2 object-cover ring-2 ring-violet-500/30 group-hover:ring-violet-500 transition-all"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.name)}&background=random&color=fff&size=80`;
                  }}
                />
                <p className="text-xs font-medium truncate">{artist.name}</p>
                <p className="text-[10px] text-gray-400">{artist.genre}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Trending Searches */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-violet-400" />
            🔥 Trending Searches
          </h2>
          <div className="flex flex-wrap gap-2">
            {TRENDING_SEARCHES.map((term, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickSearch(term)}
                className={`px-3 py-1.5 rounded-full text-sm ${cardClasses} border hover:border-violet-500/50 transition-all hover:scale-105`}
              >
                {term}
              </button>
            ))}
          </div>
        </section>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <section className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">🔍 Search Results ({searchResults.length})</h2>
              <button
                onClick={() => setSearchResults([])}
                className={`px-3 py-1 rounded-lg ${darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200 hover:bg-gray-300'} transition-colors text-sm`}
              >
                Clear
              </button>
            </div>
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
              {searchResults.map((song) => (
                <div
                  key={song.videoId}
                  className={`flex items-center gap-3 p-3 rounded-xl ${cardClasses} border hover:border-violet-500/50 transition-all group`}
                >
                  <div className="relative">
                    <img
                      src={song.thumbnail || `https://img.youtube.com/vi/${song.videoId}/mqdefault.jpg`}
                      alt={song.title}
                      className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${song.videoId}/default.jpg`;
                      }}
                    />
                    <button
                      onClick={() => handlePlaySong(song)}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Play className="w-6 h-6 text-white" />
                    </button>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate text-sm">{song.title}</p>
                    <p className={`text-xs ${darkMode ? 'text-white/60' : 'text-gray-600'} truncate`}>
                      {song.artist}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] ${darkMode ? 'text-white/40' : 'text-gray-500'}`}>
                        {song.duration}
                      </span>
                      {favorites.has(song.videoId) && (
                        <Heart className="w-3 h-3 text-pink-500 fill-pink-500" />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => toggleFavorite(song)}
                      className={`p-2 rounded-full transition-colors ${
                        favorites.has(song.videoId) 
                          ? 'text-pink-500' 
                          : darkMode ? 'hover:bg-white/10 text-white/40' : 'hover:bg-gray-200 text-gray-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${favorites.has(song.videoId) ? 'fill-pink-500' : ''}`} />
                    </button>
                    <button
                      onClick={() => handleAddToQueue(song)}
                      className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-200'}`}
                      title="Add to queue"
                    >
                      <ListMusic className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handlePlaySong(song)}
                      className="p-2 bg-violet-500 rounded-full hover:bg-violet-600 transition-colors"
                    >
                      <Play className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recently Played */}
        {recentlyPlayed.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-violet-400" />
              ⏱️ Recently Played
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {recentlyPlayed.slice(0, 10).map((song) => (
                <button
                  key={song.videoId}
                  onClick={() => handlePlaySong(song)}
                  className={`flex-shrink-0 p-3 rounded-xl ${cardClasses} border hover:border-violet-500/50 transition-all text-left min-w-[160px] group`}
                >
                  <div className="relative mb-2">
                    <img
                      src={song.thumbnail || `https://img.youtube.com/vi/${song.videoId}/mqdefault.jpg`}
                      alt={song.title}
                      className="w-full h-20 rounded-lg object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <p className="text-xs font-medium truncate">{song.title}</p>
                  <p className={`text-[10px] ${darkMode ? 'text-white/50' : 'text-gray-500'} truncate`}>
                    {song.artist}
                  </p>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Offline Songs */}
        {cachedSongs.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-3">💾 Offline Songs ({cachedSongs.length})</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {cachedSongs.slice(0, 10).map((song) => (
                <div
                  key={song.videoId}
                  className={`flex items-center gap-3 p-3 rounded-xl ${cardClasses} border hover:border-green-500/50 transition-colors`}
                >
                  <img
                    src={song.thumbnail}
                    alt={song.title}
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate text-sm">{song.title}</p>
                    <p className={`text-xs ${darkMode ? 'text-white/60' : 'text-gray-600'} truncate`}>
                      {song.artist}
                    </p>
                  </div>
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Cached</span>
                  <button
                    onClick={() => handlePlaySong(song)}
                    className="p-2 bg-green-500 rounded-full hover:bg-green-600 transition-colors flex-shrink-0"
                  >
                    <Play className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Now Playing Bar */}
      {player.currentSong && (
        <div className={`fixed bottom-0 left-0 right-0 ${cardClasses} border-t z-40 shadow-2xl`}>
          {/* Progress Bar (clickable) */}
          <div 
            className={`w-full h-1 ${darkMode ? 'bg-white/10' : 'bg-gray-300'} cursor-pointer group`}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const percent = (e.clientX - rect.left) / rect.width;
              playerRef.current.seek(percent * player.playerState.duration);
            }}
          >
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-pink-500 relative"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center gap-4">
              {/* Song Info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <img
                  src={player.currentSong.thumbnail || `https://img.youtube.com/vi/${player.currentSong.videoId}/mqdefault.jpg`}
                  alt={player.currentSong.title}
                  className={`w-12 h-12 rounded-lg object-cover flex-shrink-0 ${player.isPlaying ? 'animate-pulse' : ''}`}
                />
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate text-sm">{player.currentSong.title}</p>
                  <p className={`text-xs ${darkMode ? 'text-white/60' : 'text-gray-600'} truncate`}>
                    {player.currentSong.artist}
                  </p>
                </div>
                <button
                  onClick={() => toggleFavorite(player.currentSong!)}
                  className={`p-2 rounded-full transition-colors ${
                    favorites.has(player.currentSong.videoId) 
                      ? 'text-pink-500' 
                      : darkMode ? 'hover:bg-white/10 text-white/40' : 'hover:bg-gray-200 text-gray-500'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${favorites.has(player.currentSong.videoId) ? 'fill-pink-500' : ''}`} />
                </button>
              </div>

              {/* Main Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => player.toggleShuffle()}
                  className={`p-2 rounded-lg transition-colors ${
                    player.playerState.isShuffle
                      ? 'bg-violet-500 text-white'
                      : darkMode
                      ? 'hover:bg-white/10 text-white/60'
                      : 'hover:bg-gray-200 text-gray-600'
                  }`}
                  title="Shuffle (S)"
                >
                  <Shuffle className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => player.previous()}
                  className={`p-2 rounded-lg ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-200'} transition-colors`}
                  title="Previous (P)"
                >
                  <SkipBack className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => player.togglePlay()}
                  className="p-3 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full hover:opacity-90 transition-opacity shadow-lg"
                  title="Play/Pause (Space)"
                >
                  {player.isPlaying ? (
                    <Pause className="w-6 h-6 text-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white ml-0.5" />
                  )}
                </button>
                
                <button
                  onClick={() => player.next()}
                  className={`p-2 rounded-lg ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-200'} transition-colors`}
                  title="Next (N)"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => {
                    const modes: Array<'none' | 'one' | 'all'> = ['none', 'one', 'all'];
                    const currentIndex = modes.indexOf(player.playerState.repeatMode);
                    player.setRepeatMode(modes[(currentIndex + 1) % modes.length]);
                  }}
                  className={`p-2 rounded-lg transition-colors relative ${
                    player.playerState.repeatMode !== 'none'
                      ? 'bg-violet-500 text-white'
                      : darkMode
                      ? 'hover:bg-white/10 text-white/60'
                      : 'hover:bg-gray-200 text-gray-600'
                  }`}
                  title="Repeat (R)"
                >
                  <Repeat className="w-4 h-4" />
                  {player.playerState.repeatMode === 'one' && (
                    <span className="absolute top-0 right-0 text-[8px] font-bold">1</span>
                  )}
                </button>
              </div>

              {/* Volume & Time */}
              <div className="flex items-center gap-3 flex-1 justify-end">
                <span className="text-xs text-gray-400 w-10 text-right">
                  {formatTime(player.playerState.currentTime)}
                </span>
                <span className="text-xs text-gray-400">/</span>
                <span className="text-xs text-gray-400 w-10">
                  {formatTime(player.playerState.duration)}
                </span>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => player.toggleMute()}
                    className={`p-2 rounded-lg ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-200'} transition-colors`}
                    title="Mute (M)"
                  >
                    {player.playerState.isMuted ? (
                      <VolumeX className="w-4 h-4 text-red-400" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={player.playerState.isMuted ? 0 : player.playerState.volume}
                    onChange={(e) => player.setVolume(Number(e.target.value))}
                    className="w-20 h-1 accent-violet-500"
                  />
                </div>
                
                <button
                  onClick={() => setShowQueue(!showQueue)}
                  className={`p-2 rounded-lg transition-colors ${
                    showQueue
                      ? 'bg-violet-500 text-white'
                      : darkMode
                      ? 'hover:bg-white/10'
                      : 'hover:bg-gray-200'
                  }`}
                  title="Queue"
                >
                  <ListMusic className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Queue Panel */}
      {showQueue && (
        <div className={`fixed right-0 top-16 bottom-20 w-80 ${cardClasses} border-l z-30 overflow-hidden flex flex-col`}>
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <ListMusic className="w-5 h-5 text-violet-400" />
              Queue ({queue.length})
            </h3>
            <button
              onClick={() => clearQueue()}
              className="text-xs px-3 py-1 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400"
            >
              Clear All
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {queue.length === 0 ? (
              <p className="text-center text-gray-400 py-8">Queue is empty</p>
            ) : (
              <div className="space-y-1">
                {queue.map((song, index) => (
                  <div
                    key={`${song.videoId}-${index}`}
                    className={`flex items-center gap-2 p-2 rounded-lg ${
                      player.currentSong?.videoId === song.videoId 
                        ? 'bg-violet-500/30 border border-violet-500/50' 
                        : darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-200/50'
                    }`}
                  >
                    <span className="text-xs w-5 text-gray-400">{index + 1}</span>
                    <img
                      src={song.thumbnail || `https://img.youtube.com/vi/${song.videoId}/default.jpg`}
                      alt={song.title}
                      className="w-8 h-8 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{song.title}</p>
                      <p className="text-[10px] text-gray-400 truncate">{song.artist}</p>
                    </div>
                    <button
                      onClick={() => {
                        playerRef.current.playSong(song, queue);
                      }}
                      className="p-1 hover:text-violet-400"
                    >
                      <Play className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => removeFromQueue(index)}
                      className="p-1 hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`${cardClasses} border rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">⚙️ Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-200'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Provider Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-3">Search Provider</label>
              <p className="text-xs text-gray-400 mb-2">
                Choose your preferred search API. Piped and Invidious are free. YouTube requires API key.
              </p>
              <div className="grid grid-cols-3 gap-2">
                {(['piped', 'invidious', 'youtube'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => handleSaveProvider(p)}
                    className={`py-2 px-3 rounded-lg transition-colors text-sm font-medium ${
                      provider === p
                        ? 'bg-violet-500 text-white'
                        : darkMode
                        ? 'bg-white/10 hover:bg-white/20'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* API Key */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">YouTube API Key (Optional)</label>
              <input
                type="password"
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                placeholder="Enter your YouTube Data API key"
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode
                    ? 'bg-white/10 border-white/20 focus:border-violet-500'
                    : 'bg-white border-gray-300 focus:border-violet-500'
                } outline-none transition-colors`}
              />
              <p className="text-xs mt-2 text-gray-400">
                <a 
                  href="https://console.cloud.google.com/apis/credentials" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-violet-400 hover:underline"
                >
                  Get a free API key from Google Cloud Console →
                </a>
              </p>
              {apiKey && (
                <p className="text-xs mt-2 text-green-400">✓ API key configured</p>
              )}
            </div>

            {/* Keyboard Shortcuts */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">⌨️ Keyboard Shortcuts</label>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div className={`p-2 rounded ${darkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                  <kbd className="font-mono bg-violet-500/20 px-1 rounded">Space</kbd> Play/Pause
                </div>
                <div className={`p-2 rounded ${darkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                  <kbd className="font-mono bg-violet-500/20 px-1 rounded">N</kbd> Next song
                </div>
                <div className={`p-2 rounded ${darkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                  <kbd className="font-mono bg-violet-500/20 px-1 rounded">P</kbd> Previous
                </div>
                <div className={`p-2 rounded ${darkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                  <kbd className="font-mono bg-violet-500/20 px-1 rounded">M</kbd> Mute
                </div>
                <div className={`p-2 rounded ${darkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                  <kbd className="font-mono bg-violet-500/20 px-1 rounded">S</kbd> Shuffle
                </div>
                <div className={`p-2 rounded ${darkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                  <kbd className="font-mono bg-violet-500/20 px-1 rounded">R</kbd> Repeat
                </div>
                <div className={`p-2 rounded ${darkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                  <kbd className="font-mono bg-violet-500/20 px-1 rounded">↑/↓</kbd> Volume
                </div>
                <div className={`p-2 rounded ${darkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                  <kbd className="font-mono bg-violet-500/20 px-1 rounded">F</kbd> Favorite
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={handleSaveApiKey}
                className="w-full py-2 px-4 bg-gradient-to-r from-violet-500 to-pink-500 hover:opacity-90 text-white rounded-lg font-medium transition-opacity"
              >
                Save Settings
              </button>
              <button
                onClick={() => {
                  handleClearCache();
                  addToast('Offline cache cleared!', 'success');
                }}
                className="w-full py-2 px-4 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-medium transition-colors"
              >
                🗑️ Clear Offline Cache
              </button>
              <button
                onClick={() => {
                  clearSearchCache();
                  addToast('Search cache cleared!', 'success');
                }}
                className="w-full py-2 px-4 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 rounded-lg font-medium transition-colors"
              >
                🧹 Clear Search Cache
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className="fixed bottom-24 right-4 space-y-2 z-50 max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded-lg shadow-lg animate-slide-in ${
              toast.type === 'success'
                ? 'bg-green-500 text-white'
                : toast.type === 'error'
                ? 'bg-red-500 text-white'
                : 'bg-blue-500 text-white'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default App;
