import { openDB, type IDBPDatabase } from 'idb';
import type { Song, CachedSong } from '@/types';

const DB_NAME = 'MusicPlayerDB';
const DB_VERSION = 1;
const CACHE_STORE = 'songs';

interface SongWithBlob extends Song {
  blob: Blob;
  cachedAt: number;
}

let dbPromise: Promise<IDBPDatabase> | null = null;

async function getDB(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(CACHE_STORE)) {
          const store = db.createObjectStore(CACHE_STORE, { keyPath: 'videoId' });
          store.createIndex('title', 'title');
          store.createIndex('artist', 'artist');
          store.createIndex('cachedAt', 'cachedAt');
        }
      },
    });
  }
  return dbPromise;
}

export async function cacheSong(song: Song, audioBlob: Blob): Promise<void> {
  try {
    const db = await getDB();
    const tx = db.transaction(CACHE_STORE, 'readwrite');
    const store = tx.objectStore(CACHE_STORE);

    const cachedSong: SongWithBlob = {
      ...song,
      blob: audioBlob,
      cachedAt: Date.now(),
    };

    await store.put(cachedSong);
    await tx.done;
  } catch (error) {
    console.error('Error caching song:', error);
  }
}

export async function getCachedSong(videoId: string): Promise<CachedSong | null> {
  try {
    const db = await getDB();
    const song = await db.get(CACHE_STORE, videoId);
    return song as CachedSong || null;
  } catch (error) {
    console.error('Error getting cached song:', error);
    return null;
  }
}

export async function isSongCached(videoId: string): Promise<boolean> {
  try {
    const db = await getDB();
    const song = await db.get(CACHE_STORE, videoId);
    return song !== undefined;
  } catch {
    return false;
  }
}

export async function getCachedSongs(limit: number = 50): Promise<Song[]> {
  try {
    const db = await getDB();
    const songs = await db.getAll(CACHE_STORE);
    return songs
      .map((s: SongWithBlob) => ({
        videoId: s.videoId,
        title: s.title,
        artist: s.artist,
        thumbnail: s.thumbnail,
        duration: s.duration,
        durationSeconds: s.durationSeconds,
        isCached: true,
      }))
      .slice(0, limit);
  } catch {
    return [];
  }
}

export async function clearCache(): Promise<void> {
  try {
    const db = await getDB();
    const tx = db.transaction(CACHE_STORE, 'readwrite');
    const store = tx.objectStore(CACHE_STORE);
    await store.clear();
    await tx.done;
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
}

export async function deleteCachedSong(videoId: string): Promise<void> {
  try {
    const db = await getDB();
    await db.delete(CACHE_STORE, videoId);
  } catch (error) {
    console.error('Error deleting cached song:', error);
  }
}

export async function getCacheStats(): Promise<{ count: number; size: number }> {
  try {
    const db = await getDB();
    const count = await db.count(CACHE_STORE);
    const songs = await getCachedSongs();
    const size = songs.length * 5 * 1024 * 1024; // Approximate 5MB per song

    return { count, size };
  } catch {
    return { count: 0, size: 0 };
  }
}

export { getDB };
