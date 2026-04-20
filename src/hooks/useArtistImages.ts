import { useState, useEffect } from 'react';
import { POPULAR_ARTISTS, Artist } from '@/data/artists';

const fetchRealImage = async (name: string): Promise<string | null> => {
  try {
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`
    );
    const data = await response.json();
    if (data.thumbnail && data.thumbnail.source) {
      return data.thumbnail.source;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const useArtistImages = () => {
  const [artists, setArtists] = useState<Artist[]>(POPULAR_ARTISTS);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadImages = async () => {
      setLoading(true);
      
      const updatedArtists = await Promise.all(
        POPULAR_ARTISTS.map(async (artist) => {
          const realImage = await fetchRealImage(artist.name);
          return {
            ...artist,
            image: realImage || artist.image, 
          };
        })
      );
      
      setArtists(updatedArtists);
      setLoading(false);
    };

    loadImages();
  }, []);

  return { artists, loading };
};
