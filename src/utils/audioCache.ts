import type { Song, CachedSong } from '@/types';
import { cacheSong, getCachedSong, isSongCached } from './cache';

export async function loadCachedSong(videoId: string): Promise<CachedSong | null> {
  return getCachedSong(videoId);
}

export function revokeObjectURL(url: string): void {
  if (url) {
    URL.revokeObjectURL(url);
  }
}

export async function cacheAudioBlob(song: Song, blob: Blob): Promise<void> {
  await cacheSong(song, blob);
}

export async function checkIfCached(videoId: string): Promise<boolean> {
  return isSongCached(videoId);
}

// Function to download audio from YouTube (simplified - in production, use a backend service)
export async function downloadAudio(_videoId: string): Promise<Blob | null> {
  // Note: Direct audio download from YouTube violates ToS
  // This is a placeholder - in production, use a proper audio extraction service
  // For now, we'll return null and rely on YouTube IFrame API
  return null;
}

// Mock function for testing - creates a dummy audio blob
export function createDummyAudioBlob(): Blob {
  // This is just for testing - returns a simple WAV file
  const sampleRate = 44100;
  const duration = 2; // seconds
  const numSamples = sampleRate * duration;
  const buffer = new ArrayBuffer(numSamples * 2);
  const view = new Int16Array(buffer);

  for (let i = 0; i < numSamples; i++) {
    view[i] = 0;
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

// Simulate caching a song after it's played
export async function simulateCacheSong(song: Song): Promise<void> {
  try {
    // In a real app, you would capture the audio stream
    // For now, we'll just mark it as cached in localStorage
    const cached = await getCachedSong(song.videoId);
    if (!cached) {
      const dummyBlob = createDummyAudioBlob();
      await cacheSong(song, dummyBlob);
    }
  } catch (error) {
    console.error('Error simulating cache:', error);
  }
}
