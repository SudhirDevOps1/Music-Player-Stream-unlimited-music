import { useState, useEffect, useCallback } from 'react';
import type { Song } from '@/types';
import { getCachedSongs, clearCache, getCacheStats } from '@/utils/cache';

export function useOfflineCache() {
  const [cachedSongs, setCachedSongs] = useState<Song[]>([]);
  const [cacheStats, setCacheStats] = useState({
    totalSongs: 0,
    totalSize: 0,
    totalSizeFormatted: '0 MB',
  });

  const loadCachedSongs = useCallback(async () => {
    try {
      const songs = await getCachedSongs(50);
      setCachedSongs(songs);
    } catch (error) {
      console.error('Error loading cached songs:', error);
    }
  }, []);

  const loadCacheStats = useCallback(async () => {
    try {
      const stats = await getCacheStats();
      const sizeMB = Math.round(stats.size / (1024 * 1024));
      setCacheStats({
        totalSongs: stats.count,
        totalSize: stats.size,
        totalSizeFormatted: `${sizeMB} MB`,
      });
    } catch (error) {
      console.error('Error loading cache stats:', error);
    }
  }, []);

  const handleClearCache = useCallback(async () => {
    try {
      await clearCache();
      setCachedSongs([]);
      setCacheStats({
        totalSongs: 0,
        totalSize: 0,
        totalSizeFormatted: '0 MB',
      });
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }, []);

  useEffect(() => {
    loadCachedSongs();
    loadCacheStats();
  }, [loadCachedSongs, loadCacheStats]);

  return {
    cachedSongs,
    cacheStats,
    loadCachedSongs,
    loadCacheStats,
    handleClearCache,
  };
}
