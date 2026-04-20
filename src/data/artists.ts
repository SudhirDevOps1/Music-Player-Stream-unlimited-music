export interface Artist {
  id: string;
  name: string;
  image: string;
  genre: string;
}

// Helper to generate consistent avatar URLs
const getArtistAvatar = (name: string) => 
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=150&font-size=0.33&bold=true`;

export const POPULAR_ARTISTS: Artist[] = [
  // Bollywood Playback Singers
  {
    id: 'arijit-singh',
    name: 'Arijit Singh',
    image: getArtistAvatar('Arijit Singh'),
    genre: 'Bollywood',
  },
  {
    id: 'shreya-ghoshal',
    name: 'Shreya Ghoshal',
    image: getArtistAvatar('Shreya Ghoshal'),
    genre: 'Bollywood',
  },
  {
    id: 'sonu-nigam',
    name: 'Sonu Nigam',
    image: getArtistAvatar('Sonu Nigam'),
    genre: 'Bollywood',
  },
  {
    id: 'lata-mangeshkar',
    name: 'Lata Mangeshkar',
    image: getArtistAvatar('Lata Mangeshkar'),
    genre: 'Bollywood',
  },
  {
    id: 'kumar-sanu',
    name: 'Kumar Sanu',
    image: getArtistAvatar('Kumar Sanu'),
    genre: 'Bollywood',
  },
  {
    id: 'udit-narayan',
    name: 'Udit Narayan',
    image: getArtistAvatar('Udit Narayan'),
    genre: 'Bollywood',
  },
  {
    id: 'alka-yagnik',
    name: 'Alka Yagnik',
    image: getArtistAvatar('Alka Yagnik'),
    genre: 'Bollywood',
  },
  {
    id: 'asha-bhosle',
    name: 'Asha Bhosle',
    image: getArtistAvatar('Asha Bhosle'),
    genre: 'Bollywood',
  },
  {
    id: 'kishore-kumar',
    name: 'Kishore Kumar',
    image: getArtistAvatar('Kishore Kumar'),
    genre: 'Bollywood',
  },
  {
    id: 'mohammed-rafi',
    name: 'Mohammed Rafi',
    image: getArtistAvatar('Mohammed Rafi'),
    genre: 'Bollywood',
  },
  {
    id: 'kk',
    name: 'KK',
    image: getArtistAvatar('KK Singer'),
    genre: 'Bollywood',
  },
  {
    id: 'jubin-nautiyal',
    name: 'Jubin Nautiyal',
    image: getArtistAvatar('Jubin Nautiyal'),
    genre: 'Bollywood',
  },
  {
    id: 'darshan-raval',
    name: 'Darshan Raval',
    image: getArtistAvatar('Darshan Raval'),
    genre: 'Bollywood',
  },
  {
    id: 'neha-kakkar',
    name: 'Neha Kakkar',
    image: getArtistAvatar('Neha Kakkar'),
    genre: 'Bollywood',
  },
  {
    id: 'sunidhi-chauhan',
    name: 'Sunidhi Chauhan',
    image: getArtistAvatar('Sunidhi Chauhan'),
    genre: 'Bollywood',
  },
  {
    id: 'shaan',
    name: 'Shaan',
    image: getArtistAvatar('Shaan Singer'),
    genre: 'Bollywood',
  },
  {
    id: 'atif-aslam',
    name: 'Atif Aslam',
    image: getArtistAvatar('Atif Aslam'),
    genre: 'Bollywood',
  },
  {
    id: 'ankit-tiwari',
    name: 'Ankit Tiwari',
    image: getArtistAvatar('Ankit Tiwari'),
    genre: 'Bollywood',
  },
  {
    id: 'palak-muchhal',
    name: 'Palak Muchhal',
    image: getArtistAvatar('Palak Muchhal'),
    genre: 'Bollywood',
  },
  {
    id: 'monali-thakur',
    name: 'Monali Thakur',
    image: getArtistAvatar('Monali Thakur'),
    genre: 'Bollywood',
  },
  
  // Music Composers
  {
    id: 'ar-rahman',
    name: 'AR Rahman',
    image: getArtistAvatar('AR Rahman'),
    genre: 'Composer',
  },
  {
    id: 'pritam',
    name: 'Pritam',
    image: getArtistAvatar('Pritam'),
    genre: 'Composer',
  },
  {
    id: 'vishal-shekhar',
    name: 'Vishal-Shekhar',
    image: getArtistAvatar('Vishal Shekhar'),
    genre: 'Composer',
  },
  {
    id: 'mithoon',
    name: 'Mithoon',
    image: getArtistAvatar('Mithoon'),
    genre: 'Composer',
  },
  {
    id: 'amaal-mallik',
    name: 'Amaal Mallik',
    image: getArtistAvatar('Amaal Mallik'),
    genre: 'Composer',
  },
  {
    id: 'tanishk-bagchi',
    name: 'Tanishk Bagchi',
    image: getArtistAvatar('Tanishk Bagchi'),
    genre: 'Composer',
  },
  
  // Punjabi Artists
  {
    id: 'diljit-dosanjh',
    name: 'Diljit Dosanjh',
    image: getArtistAvatar('Diljit Dosanjh'),
    genre: 'Punjabi',
  },
  {
    id: 'ap-dhillon',
    name: 'AP Dhillon',
    image: getArtistAvatar('AP Dhillon'),
    genre: 'Punjabi',
  },
  {
    id: 'guru-randhawa',
    name: 'Guru Randhawa',
    image: getArtistAvatar('Guru Randhawa'),
    genre: 'Punjabi',
  },
  {
    id: 'mika-singh',
    name: 'Mika Singh',
    image: getArtistAvatar('Mika Singh'),
    genre: 'Punjabi',
  },
  {
    id: 'yo-yo-honey-singh',
    name: 'Yo Yo Honey Singh',
    image: getArtistAvatar('Yo Yo Honey Singh'),
    genre: 'Punjabi',
  },
  {
    id: 'sidhu-moose-wala',
    name: 'Sidhu Moose Wala',
    image: getArtistAvatar('Sidhu Moose Wala'),
    genre: 'Punjabi',
  },
  {
    id: 'hans-raj-hans',
    name: 'Hans Raj Hans',
    image: getArtistAvatar('Hans Raj Hans'),
    genre: 'Punjabi',
  },
  {
    id: 'gurdas-maan',
    name: 'Gurdas Maan',
    image: getArtistAvatar('Gurdas Maan'),
    genre: 'Punjabi',
  },
  {
    id: 'b-praak',
    name: 'B Praak',
    image: getArtistAvatar('B Praak'),
    genre: 'Punjabi',
  },
  
  // Bhojpuri Artists
  {
    id: 'pawan-singh',
    name: 'Pawan Singh',
    image: getArtistAvatar('Pawan Singh'),
    genre: 'Bhojpuri',
  },
  {
    id: 'khesari-lal-yadav',
    name: 'Khesari Lal Yadav',
    image: getArtistAvatar('Khesari Lal Yadav'),
    genre: 'Bhojpuri',
  },
  {
    id: 'dinesh-lal-yadav',
    name: 'Dinesh Lal Yadav',
    image: getArtistAvatar('Dinesh Lal Yadav'),
    genre: 'Bhojpuri',
  },
  {
    id: 'ravi-kishan',
    name: 'Ravi Kishan',
    image: getArtistAvatar('Ravi Kishan'),
    genre: 'Bhojpuri',
  },
  {
    id: 'kalpana-patowary',
    name: 'Kalpana Patowary',
    image: getArtistAvatar('Kalpana Patowary'),
    genre: 'Bhojpuri',
  },
  {
    id: 'manoj-tiwari',
    name: 'Manoj Tiwari',
    image: getArtistAvatar('Manoj Tiwari'),
    genre: 'Bhojpuri',
  },
  {
    id: 'bharat-sharma',
    name: 'Bharat Sharma',
    image: getArtistAvatar('Bharat Sharma'),
    genre: 'Bhojpuri',
  },
  {
    id: 'anjali-tiwari',
    name: 'Anjali Tiwari',
    image: getArtistAvatar('Anjali Tiwari'),
    genre: 'Bhojpuri',
  },
  
  // Hip-Hop/Rap
  {
    id: 'divine',
    name: 'Divine',
    image: getArtistAvatar('Divine Rapper'),
    genre: 'Hip-Hop',
  },
  {
    id: 'raftaar',
    name: 'Raftaar',
    image: getArtistAvatar('Raftaar'),
    genre: 'Hip-Hop',
  },
  {
    id: 'badshah',
    name: 'Badshah',
    image: getArtistAvatar('Badshah'),
    genre: 'Hip-Hop',
  },
  {
    id: 'king',
    name: 'King',
    image: getArtistAvatar('King Rapper'),
    genre: 'Hip-Hop',
  },
  {
    id: 'emiway-bantai',
    name: 'Emiway Bantai',
    image: getArtistAvatar('Emiway Bantai'),
    genre: 'Hip-Hop',
  },
  {
    id: 'mc-stan',
    name: 'MC Stan',
    image: getArtistAvatar('MC Stan'),
    genre: 'Hip-Hop',
  },
  {
    id: 'tony-kakkar',
    name: 'Tony Kakkar',
    image: getArtistAvatar('Tony Kakkar'),
    genre: 'Pop',
  },
];

// Trending searches
export const TRENDING_SEARCHES = [
  'Kesariya',
  'Apna Bana Le',
  'Chaleya',
  'Maan Meri Jaan',
  'Heeriye',
  'Husn',
  'Tere Vaaste',
  'Pehle Bhi Main',
  'Tum Hi Ho',
  'Brown Munde',
  'Raataan Lambiyan',
  'Pasoori',
  'Dil Nu',
  'Excuses',
  'Insane',
  'Ambar',
  'Kahani Suno',
  'O Bedardeya',
  'Coca Cola',
  'Dhoka',
  'Bhojpuri Hit Songs',
  'Pawan Singh New Song',
  'Khesari Lal Yadav Songs',
  'Bollywood New Songs 2024',
  'Arijit Singh Best Songs',
  'Punjabi Hits 2024',
];

// Moods
export const MOODS = [
  { id: 'romantic', name: '💕 Romantic', query: 'romantic bollywood songs' },
  { id: 'party', name: '🎉 Party', query: 'party songs bollywood' },
  { id: 'sad', name: '😢 Sad', query: 'sad bollywood songs' },
  { id: 'devotional', name: '🙏 Devotional', query: 'bhajan devotional songs' },
  { id: 'workout', name: '💪 Workout', query: 'workout gym songs bollywood' },
  { id: 'chill', name: '🌙 Chill', query: 'chill lofi songs' },
  { id: 'punjabi', name: '🎶 Punjabi', query: 'punjabi hit songs' },
  { id: 'retro', name: '🎻 Retro', query: 'old bollywood classic songs' },
  { id: 'bhojpuri', name: '🎤 Bhojpuri', query: 'bhojpuri hit songs' },
  { id: 'wedding', name: '💒 Wedding', query: 'wedding songs bollywood' },
];
