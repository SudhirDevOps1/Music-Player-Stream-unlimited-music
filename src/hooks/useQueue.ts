import { useState, useCallback } from 'react';
import type { Song } from '@/types';

export function useQueue() {
  const [queue, setQueue] = useState<Song[]>([]);

  // Add a single song or multiple songs (prevents duplicates automatically)
  const addToQueue = useCallback((songOrSongs: Song | Song[]) => {
    setQueue((prev) => {
      const songsToAdd = Array.isArray(songOrSongs) ? songOrSongs : [songOrSongs];
      const existingIds = new Set(prev.map(s => s.videoId));
      
      // Filter out songs that are already in the queue
      const newSongs = songsToAdd.filter(s => !existingIds.has(s.videoId));
      
      return [...prev, ...newSongs];
    });
  }, []);

  // Remove song by index
  const removeFromQueue = useCallback((index: number) => {
    setQueue((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Remove song by videoId (Safer, prevents index shifting bugs)
  const removeFromQueueById = useCallback((videoId: string) => {
    setQueue((prev) => prev.filter((s) => s.videoId !== videoId));
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  const updateQueue = useCallback((newQueue: Song[]) => {
    setQueue(newQueue);
  }, []);

  return {
    queue,
    addToQueue,
    removeFromQueue,
    removeFromQueueById,
    clearQueue,
    updateQueue,
  };
}
