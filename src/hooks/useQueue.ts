import { useState, useCallback } from 'react';
import type { Song } from '@/types';

export function useQueue() {
  const [queue, setQueue] = useState<Song[]>([]);

  const addToQueue = useCallback((song: Song) => {
    setQueue((prev) => [...prev, song]);
  }, []);

  const removeFromQueue = useCallback((index: number) => {
    setQueue((prev) => prev.filter((_, i) => i !== index));
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
    clearQueue,
    updateQueue,
  };
}
