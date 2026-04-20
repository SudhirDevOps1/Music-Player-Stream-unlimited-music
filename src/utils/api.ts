import type { Song } from '@/types';

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface CachedResult {
  data: Song[];
  timestamp: number;
  provider: string;
}

function getCacheKey(query: string): string {
  return `music_search_${query.toLowerCase().trim()}`;
}

function getCachedResult(query: string): Song[] | null {
  try {
    const cached = localStorage.getItem(getCacheKey(query));
    if (!cached) return null;
    const parsed: CachedResult = JSON.parse(cached);
    if (Date.now() - parsed.timestamp > CACHE_DURATION) {
      localStorage.removeItem(getCacheKey(query));
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
}

function cacheResult(query: string, songs: Song[], provider: string): void {
  try {
    const cached: CachedResult = { data: songs, timestamp: Date.now(), provider };
    localStorage.setItem(getCacheKey(query), JSON.stringify(cached));
  } catch {
    // Ignore cache errors
  }
}

async function fetchWithTimeout(url: string, timeout: number = 10000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { 
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      }
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

function formatDuration(seconds: number | string): string {
  if (!seconds) return '0:00';
  const num = typeof seconds === 'string' ? parseInt(seconds) : seconds;
  if (!num || isNaN(num) || num <= 0) return '0:00';
  const mins = Math.floor(num / 60);
  const secs = Math.floor(num % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Piped API instances (multiple for redundancy)
const PIPED_INSTANCES = [
  'https://pipedapi.kavin.rocks',
  'https://pipedapi.adminforge.de',
  'https://pipedapi.r4fo.com',
];

// Invidious API instances
const INVIDIOUS_INSTANCES = [
  'https://inv.nadeko.net',
  'https://invidious.privacyredirect.com',
  'https://video.strongthany.cc',
];

// Piped API search
async function searchPiped(query: string): Promise<Song[]> {
  for (const instance of PIPED_INSTANCES) {
    try {
      console.log('Trying Piped instance:', instance);
      const url = `${instance}/search?q=${encodeURIComponent(query)}&filter=videos`;
      const response = await fetchWithTimeout(url, 10000);
      
      if (!response.ok) {
        console.warn(`Piped ${instance} error:`, response.status);
        continue;
      }
      
      const data = await response.json();
      
      if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
        console.warn(`Piped ${instance}: No items`);
        continue;
      }
      
      const songs: Song[] = data.items
        .filter((item: any) => item.url || item.id)
        .slice(0, 20)
        .map((item: any): Song => {
          // Extract videoId from URL or use id field
          let videoId = item.id || '';
          if (!videoId && item.url) {
            const match = item.url.match(/[?&]v=([^&]+)/);
            videoId = match ? match[1] : item.url.split('/').pop() || '';
          }
          
          return {
            videoId: videoId.trim(),
            title: (item.title || 'Unknown').toString().replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim(),
            artist: (item.uploaderName || item.uploader || 'Unknown Artist').toString().trim(),
            thumbnail: item.thumbnail || `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
            duration: item.duration ? formatDuration(item.duration) : '0:00',
            durationSeconds: typeof item.duration === 'number' ? Math.floor(item.duration) : 0,
          };
        })
        .filter((song: Song) => song.videoId && song.videoId.length > 3);
      
      if (songs.length > 0) {
        console.log('Piped found:', songs.length, 'songs from', instance);
        return songs;
      }
    } catch (error) {
      console.error(`Piped ${instance} error:`, error);
      continue;
    }
  }
  
  return [];
}

// Invidious API search
async function searchInvidious(query: string): Promise<Song[]> {
  for (const instance of INVIDIOUS_INSTANCES) {
    try {
      console.log('Trying Invidious instance:', instance);
      const url = `${instance}/api/v1/search?q=${encodeURIComponent(query)}&type=video`;
      const response = await fetchWithTimeout(url, 10000);
      
      if (!response.ok) {
        console.warn(`Invidious ${instance} error:`, response.status);
        continue;
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data) || data.length === 0) {
        console.warn(`Invidious ${instance}: No items`);
        continue;
      }
      
      const songs: Song[] = data
        .filter((item: any) => item.videoId && item.title)
        .slice(0, 20)
        .map((item: any) => ({
          videoId: item.videoId,
          title: (item.title || 'Unknown').toString().replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'),
          artist: (item.author || 'Unknown Artist').toString(),
          thumbnail: item.videoThumbnails?.[0]?.url || `https://img.youtube.com/vi/${item.videoId}/mqdefault.jpg`,
          duration: item.lengthSeconds ? formatDuration(item.lengthSeconds) : '0:00',
          durationSeconds: item.lengthSeconds || 0,
        }));
      
      if (songs.length > 0) {
        console.log('Invidious found:', songs.length, 'songs from', instance);
        return songs;
      }
    } catch (error) {
      console.error(`Invidious ${instance} error:`, error);
      continue;
    }
  }
  
  return [];
}

// YouTube API search
async function searchYouTube(query: string, apiKey: string): Promise<Song[]> {
  if (!apiKey) return [];
  
  try {
    console.log('Searching YouTube with API key');
    const url = new URL('https://www.googleapis.com/youtube/v3/search');
    url.searchParams.set('part', 'snippet');
    url.searchParams.set('q', query);
    url.searchParams.set('type', 'video');
    url.searchParams.set('maxResults', '20');
    url.searchParams.set('key', apiKey);
    
    const response = await fetchWithTimeout(url.toString(), 10000);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.warn('YouTube API error:', errorData);
      throw new Error(errorData.error?.message || `HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.items || !Array.isArray(data.items)) {
      throw new Error('Invalid YouTube response');
    }
    
    const songs: Song[] = data.items
      .filter((item: any) => item.id?.videoId)
      .map((item: any): Song => ({
        videoId: item.id.videoId,
        title: (item.snippet.title || 'Unknown').toString().replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'),
        artist: (item.snippet.channelTitle || 'Unknown Artist').toString(),
        thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || `https://img.youtube.com/vi/${item.id.videoId}/mqdefault.jpg`,
        duration: '0:00',
        durationSeconds: 0,
      }));
    
    console.log('YouTube found:', songs.length, 'songs');
    return songs;
  } catch (error) {
    console.error('YouTube API search error:', error);
    return [];
  }
}

export async function searchSongs(
  query: string,
  apiKey?: string,
  preferredProvider: 'invidious' | 'piped' | 'youtube' = 'piped'
): Promise<{ songs: Song[]; provider: string }> {
  if (!query?.trim()) {
    return { songs: [], provider: 'none' };
  }

  const trimmedQuery = query.trim();
  
  // Check cache first
  const cached = getCachedResult(trimmedQuery);
  if (cached && cached.length > 0) {
    console.log('Returning cached results:', cached.length, 'songs');
    return { songs: cached, provider: 'cache' };
  }

  let songs: Song[] = [];
  let usedProvider: string = preferredProvider;

  // Try preferred provider first, then fallbacks
  const providers: Array<{ name: string; fn: () => Promise<Song[]> }> = [];
  
  if (preferredProvider === 'piped') {
    providers.push({ name: 'piped', fn: () => searchPiped(trimmedQuery) });
    providers.push({ name: 'invidious', fn: () => searchInvidious(trimmedQuery) });
  } else if (preferredProvider === 'invidious') {
    providers.push({ name: 'invidious', fn: () => searchInvidious(trimmedQuery) });
    providers.push({ name: 'piped', fn: () => searchPiped(trimmedQuery) });
  } else if (preferredProvider === 'youtube' && apiKey) {
    providers.push({ name: 'youtube', fn: () => searchYouTube(trimmedQuery, apiKey!) });
    providers.push({ name: 'piped', fn: () => searchPiped(trimmedQuery) });
    providers.push({ name: 'invidious', fn: () => searchInvidious(trimmedQuery) });
  } else {
    // Default: try all free providers
    providers.push({ name: 'piped', fn: () => searchPiped(trimmedQuery) });
    providers.push({ name: 'invidious', fn: () => searchInvidious(trimmedQuery) });
  }

  // Try each provider
  for (const provider of providers) {
    try {
      songs = await provider.fn();
      if (songs.length > 0) {
        usedProvider = provider.name;
        cacheResult(trimmedQuery, songs, usedProvider);
        console.log(`Search successful with ${provider.name}:`, songs.length, 'songs');
        return { songs, provider: usedProvider as 'piped' | 'invidious' | 'youtube' | 'cache' | 'failed' };
      }
    } catch (error) {
      console.error(`${provider.name} failed:`, error);
      continue;
    }
  }

  // If still no results and user has API key, try YouTube
  if (songs.length === 0 && apiKey && preferredProvider !== 'youtube') {
    try {
      songs = await searchYouTube(trimmedQuery, apiKey);
      if (songs.length > 0) {
        cacheResult(trimmedQuery, songs, 'youtube');
        return { songs, provider: 'youtube' };
      }
    } catch (error) {
      console.error('YouTube fallback error:', error);
    }
  }

  console.warn('No results found for:', trimmedQuery);
  return { songs: [], provider: 'failed' };
}

export function clearSearchCache(): void {
  Object.keys(localStorage)
    .filter(k => k.startsWith('music_search_'))
    .forEach(k => localStorage.removeItem(k));
}
