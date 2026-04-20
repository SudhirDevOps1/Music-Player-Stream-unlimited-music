import React from 'react';
import { useArtistImages } from './useArtistImages';

const ArtistList = () => {
  const { artists, loading } = useArtistImages();

  if (loading) {
    return <div className="text-white p-4">Loading artists images...</div>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 p-4">
      {artists.map((artist) => (
        <div key={artist.id} className="flex flex-col items-center text-center">
          <img
            src={artist.image}
            alt={artist.name}
            // अगर फोटो थोड़ी अजीब आए तो object-cover उसे crop करके गोल बना देगा
            className="w-28 h-28 rounded-full object-cover shadow-lg mb-3 hover:scale-105 transition-transform duration-300" 
          />
          <h3 className="text-white font-semibold text-sm">{artist.name}</h3>
          <p className="text-gray-400 text-xs">{artist.genre}</p>
        </div>
      ))}
    </div>
  );
};

export default ArtistList;
