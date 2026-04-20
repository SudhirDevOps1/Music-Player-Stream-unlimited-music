export interface Artist {
  id: string;
  name: string;
  image: string;
  genre: string;
}

// Helper to generate consistent, beautiful, and reliable avatars (Dicebear API - 100% Uptime)
const getArtistAvatar = (name: string) => 
  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=c084fc,fb7185,f59e0b,6366f1,22d3ee&textColor=ffffff`;

export const POPULAR_ARTISTS: Artist[] = [
  // ─── Bollywood Playback Singers ───
  { id: 'arijit-singh', name: 'Arijit Singh', image: getArtistAvatar('Arijit Singh'), genre: 'Bollywood' },
  { id: 'shreya-ghoshal', name: 'Shreya Ghoshal', image: getArtistAvatar('Shreya Ghoshal'), genre: 'Bollywood' },
  { id: 'sonu-nigam', name: 'Sonu Nigam', image: getArtistAvatar('Sonu Nigam'), genre: 'Bollywood' },
  { id: 'lata-mangeshkar', name: 'Lata Mangeshkar', image: getArtistAvatar('Lata Mangeshkar'), genre: 'Bollywood' },
  { id: 'kumar-sanu', name: 'Kumar Sanu', image: getArtistAvatar('Kumar Sanu'), genre: 'Bollywood' },
  { id: 'udit-narayan', name: 'Udit Narayan', image: getArtistAvatar('Udit Narayan'), genre: 'Bollywood' },
  { id: 'alka-yagnik', name: 'Alka Yagnik', image: getArtistAvatar('Alka Yagnik'), genre: 'Bollywood' },
  { id: 'asha-bhosle', name: 'Asha Bhosle', image: getArtistAvatar('Asha Bhosle'), genre: 'Bollywood' },
  { id: 'kishore-kumar', name: 'Kishore Kumar', image: getArtistAvatar('Kishore Kumar'), genre: 'Bollywood' },
  { id: 'mohammed-rafi', name: 'Mohammed Rafi', image: getArtistAvatar('Mohammed Rafi'), genre: 'Bollywood' },
  { id: 'kk', name: 'KK', image: getArtistAvatar('KK Singer'), genre: 'Bollywood' },
  { id: 'jubin-nautiyal', name: 'Jubin Nautiyal', image: getArtistAvatar('Jubin Nautiyal'), genre: 'Bollywood' },
  { id: 'darshan-raval', name: 'Darshan Raval', image: getArtistAvatar('Darshan Raval'), genre: 'Bollywood' },
  { id: 'neha-kakkar', name: 'Neha Kakkar', image: getArtistAvatar('Neha Kakkar'), genre: 'Bollywood' },
  { id: 'sunidhi-chauhan', name: 'Sunidhi Chauhan', image: getArtistAvatar('Sunidhi Chauhan'), genre: 'Bollywood' },
  { id: 'shaan', name: 'Shaan', image: getArtistAvatar('Shaan Singer'), genre: 'Bollywood' },
  { id: 'atif-aslam', name: 'Atif Aslam', image: getArtistAvatar('Atif Aslam'), genre: 'Bollywood' },
  { id: 'ankit-tiwari', name: 'Ankit Tiwari', image: getArtistAvatar('Ankit Tiwari'), genre: 'Bollywood' },
  { id: 'palak-muchhal', name: 'Palak Muchhal', image: getArtistAvatar('Palak Muchhal'), genre: 'Bollywood' },
  { id: 'monali-thakur', name: 'Monali Thakur', image: getArtistAvatar('Monali Thakur'), genre: 'Bollywood' },
  { id: 'armaan-malik', name: 'Armaan Malik', image: getArtistAvatar('Armaan Malik'), genre: 'Bollywood' },
  { id: 'papon', name: 'Papon', image: getArtistAvatar('Papon Singer'), genre: 'Bollywood' },
  { id: 'mohit-chauhan', name: 'Mohit Chauhan', image: getArtistAvatar('Mohit Chauhan'), genre: 'Bollywood' },
  { id: 'rahat-fateh-ali-khan', name: 'Rahat Fateh Ali Khan', image: getArtistAvatar('Rahat Fateh Ali Khan'), genre: 'Bollywood' },
  { id: 'kanika-kapoor', name: 'Kanika Kapoor', image: getArtistAvatar('Kanika Kapoor'), genre: 'Bollywood' },

  // ─── Music Composers ───
  { id: 'ar-rahman', name: 'AR Rahman', image: getArtistAvatar('AR Rahman'), genre: 'Composer' },
  { id: 'pritam', name: 'Pritam', image: getArtistAvatar('Pritam'), genre: 'Composer' },
  { id: 'vishal-shekhar', name: 'Vishal-Shekhar', image: getArtistAvatar('Vishal Shekhar'), genre: 'Composer' },
  { id: 'mithoon', name: 'Mithoon', image: getArtistAvatar('Mithoon'), genre: 'Composer' },
  { id: 'amaaal-mallik', name: 'Amaal Mallik', image: getArtistAvatar('Amaal Mallik'), genre: 'Composer' },
  { id: 'tanishk-bagchi', name: 'Tanishk Bagchi', image: getArtistAvatar('Tanishk Bagchi'), genre: 'Composer' },
  { id: 'amit-trivedi', name: 'Amit Trivedi', image: getArtistAvatar('Amit Trivedi'), genre: 'Composer' },
  { id: 'sachin-jigar', name: 'Sachin-Jigar', image: getArtistAvatar('Sachin Jigar'), genre: 'Composer' },
  { id: 'salim-sulaiman', name: 'Salim-Sulaiman', image: getArtistAvatar('Salim Sulaiman'), genre: 'Composer' },
  { id: 'jasleen-royal', name: 'Jasleen Royal', image: getArtistAvatar('Jasleen Royal'), genre: 'Composer' },

  // ─── Punjabi Artists ───
  { id: 'diljit-dosanjh', name: 'Diljit Dosanjh', image: getArtistAvatar('Diljit Dosanjh'), genre: 'Punjabi' },
  { id: 'ap-dhillon', name: 'AP Dhillon', image: getArtistAvatar('AP Dhillon'), genre: 'Punjabi' },
  { id: 'guru-randhawa', name: 'Guru Randhawa', image: getArtistAvatar('Guru Randhawa'), genre: 'Punjabi' },
  { id: 'mika-singh', name: 'Mika Singh', image: getArtistAvatar('Mika Singh'), genre: 'Punjabi' },
  { id: 'yo-yo-honey-singh', name: 'Yo Yo Honey Singh', image: getArtistAvatar('Yo Yo Honey Singh'), genre: 'Punjabi' },
  { id: 'sidhu-moose-wala', name: 'Sidhu Moose Wala', image: getArtistAvatar('Sidhu Moose Wala'), genre: 'Punjabi' },
  { id: 'hans-raj-hans', name: 'Hans Raj Hans', image: getArtistAvatar('Hans Raj Hans'), genre: 'Punjabi' },
  { id: 'gurdas-maan', name: 'Gurdas Maan', image: getArtistAvatar('Gurdas Maan'), genre: 'Punjabi' },
  { id: 'b-praak', name: 'B Praak', image: getArtistAvatar('B Praak'), genre: 'Punjabi' },
  { id: 'karan-aujla', name: 'Karan Aujla', image: getArtistAvatar('Karan Aujla'), genre: 'Punjabi' },
  { id: 'hardy-sandhu', name: 'Hardy Sandhu', image: getArtistAvatar('Hardy Sandhu'), genre: 'Punjabi' },
  { id: 'ammy-virk', name: 'Ammy Virk', image: getArtistAvatar('Ammy Virk'), genre: 'Punjabi' },
  { id: 'sunanda-sharma', name: 'Sunanda Sharma', image: getArtistAvatar('Sunanda Sharma'), genre: 'Punjabi' },

  // ─── Bhojpuri Artists ───
  { id: 'pawan-singh', name: 'Pawan Singh', image: getArtistAvatar('Pawan Singh'), genre: 'Bhojpuri' },
  { id: 'khesari-lal-yadav', name: 'Khesari Lal Yadav', image: getArtistAvatar('Khesari Lal Yadav'), genre: 'Bhojpuri' },
  { id: 'dinesh-lal-yadav', name: 'Dinesh Lal Yadav', image: getArtistAvatar('Dinesh Lal Yadav'), genre: 'Bhojpuri' },
  { id: 'ravi-kishan', name: 'Ravi Kishan', image: getArtistAvatar('Ravi Kishan'), genre: 'Bhojpuri' },
  { id: 'kalpana-patowary', name: 'Kalpana Patowary', image: getArtistAvatar('Kalpana Patowary'), genre: 'Bhojpuri' },
  { id: 'manoj-tiwari', name: 'Manoj Tiwari', image: getArtistAvatar('Manoj Tiwari'), genre: 'Bhojpuri' },
  { id: 'bharat-sharma', name: 'Bharat Sharma', image: getArtistAvatar('Bharat Sharma'), genre: 'Bhojpuri' },
  { id: 'anjali-tiwari', name: 'Anjali Tiwari', image: getArtistAvatar('Anjali Tiwari'), genre: 'Bhojpuri' },
  { id: 'arvind-akela-kallu', name: 'Arvind Akela Kallu', image: getArtistAvatar('Arvind Akela Kallu'), genre: 'Bhojpuri' },
  { id: 'priyanka-singh', name: 'Priyanka Singh', image: getArtistAvatar('Priyanka Singh'), genre: 'Bhojpuri' },

  // ─── Hip-Hop/Rap ───
  { id: 'divine', name: 'Divine', image: getArtistAvatar('Divine Rapper'), genre: 'Hip-Hop' },
  { id: 'raftaar', name: 'Raftaar', image: getArtistAvatar('Raftaar'), genre: 'Hip-Hop' },
  { id: 'badshah', name: 'Badshah', image: getArtistAvatar('Badshah'), genre: 'Hip-Hop' },
  { id: 'king', name: 'King', image: getArtistAvatar('King Rapper'), genre: 'Hip-Hop' },
  { id: 'emiway-bantai', name: 'Emiway Bantai', image: getArtistAvatar('Emiway Bantai'), genre: 'Hip-Hop' },
  { id: 'mc-stan', name: 'MC Stan', image: getArtistAvatar('MC Stan'), genre: 'Hip-Hop' },
  { id: 'tony-kakkar', name: 'Tony Kakkar', image: getArtistAvatar('Tony Kakkar'), genre: 'Pop' },
  { id: 'seedhe-maut', name: 'Seedhe Maut', image: getArtistAvatar('Seedhe Maut'), genre: 'Hip-Hop' },
  { id: 'kr$na', name: 'KR$NA', image: getArtistAvatar('KR$NA'), genre: 'Hip-Hop' },

  // ─── South Indian ───
  { id: 'sp-balasubrahmanyam', name: 'SP Balasubrahmanyam', image: getArtistAvatar('SP Balasubrahmanyam'), genre: 'South Indian' },
  { id: 'ks-chithra', name: 'KS Chithra', image: getArtistAvatar('KS Chithra'), genre: 'South Indian' },
  { id: 'anirudh-ravichander', name: 'Anirudh Ravichander', image: getArtistAvatar('Anirudh Ravichander'), genre: 'South Indian' },
  { id: 'yuvan-shankar-raja', name: 'Yuvan Shankar Raja', image: getArtistAvatar('Yuvan Shankar Raja'), genre: 'South Indian' },
  { id: 'devi-sri-prasad', name: 'Devi Sri Prasad', image: getArtistAvatar('Devi Sri Prasad'), genre: 'South Indian' },
  { id: 'dhanush', name: 'Dhanush', image: getArtistAvatar('Dhanush'), genre: 'South Indian' },
  { id: 'shankar-mahadevan', name: 'Shankar Mahadevan', image: getArtistAvatar('Shankar Mahadevan'), genre: 'South Indian' },

  // ─── Sufi / Ghazal ───
  { id: 'nusrat-fateh-ali-khan', name: 'Nusrat Fateh Ali Khan', image: getArtistAvatar('Nusrat Fateh Ali Khan'), genre: 'Sufi' },
  { id: 'abida-parveen', name: 'Abida Parveen', image: getArtistAvatar('Abida Parveen'), genre: 'Sufi' },
  { id: 'jagjit-singh', name: 'Jagjit Singh', image: getArtistAvatar('Jagjit Singh'), genre: 'Ghazal' },
  { id: 'gulam-ali', name: 'Ghulam Ali', image: getArtistAvatar('Ghulam Ali'), genre: 'Ghazal' },
  { id: 'mehdi-hassan', name: 'Mehdi Hassan', image: getArtistAvatar('Mehdi Hassan'), genre: 'Ghazal' },
  { id: 'pankaj-udhas', name: 'Pankaj Udhas', image: getArtistAvatar('Pankaj Udhas'), genre: 'Ghazal' },

  // ─── Indian Classical ───
  { id: 'ravi-shankar', name: 'Ravi Shankar', image: getArtistAvatar('Ravi Shankar'), genre: 'Classical' },
  { id: 'zakir-hussain', name: 'Zakir Hussain', image: getArtistAvatar('Zakir Hussain'), genre: 'Classical' },
  { id: 'bhimsen-joshi', name: 'Bhimsen Joshi', image: getArtistAvatar('Bhimsen Joshi'), genre: 'Classical' },
  { id: 'ms-subbulakshmi', name: 'MS Subbulakshmi', image: getArtistAvatar('MS Subbulakshmi'), genre: 'Classical' },
  { id: 'bismillah-khan', name: 'Bismillah Khan', image: getArtistAvatar('Bismillah Khan'), genre: 'Classical' },
  { id: 'hariprasad-chaurasia', name: 'Hariprasad Chaurasia', image: getArtistAvatar('Hariprasad Chaurasia'), genre: 'Classical' },

  // ─── Indie / Alternative ───
  { id: 'prateek-kuhad', name: 'Prateek Kuhad', image: getArtistAvatar('Prateek Kuhad'), genre: 'Indie' },
  { id: 'the-local-train', name: 'The Local Train', image: getArtistAvatar('The Local Train'), genre: 'Indie' },
  { id: 'indian-ocean', name: 'Indian Ocean', image: getArtistAvatar('Indian Ocean'), genre: 'Indie' },
  { id: 'parikrama', name: 'Parikrama', image: getArtistAvatar('Parikrama'), genre: 'Indie' },
  { id: 'anuv-jain', name: 'Anuv Jain', image: getArtistAvatar('Anuv Jain'), genre: 'Indie' },

  // ─── Devotional ───
  { id: 'anup-jalota', name: 'Anup Jalota', image: getArtistAvatar('Anup Jalota'), genre: 'Devotional' },
  { id: 'morari-bapu', name: 'Morari Bapu', image: getArtistAvatar('Morari Bapu'), genre: 'Devotional' },
  { id: 'suresh-wadkar', name: 'Suresh Wadkar', image: getArtistAvatar('Suresh Wadkar'), genre: 'Devotional' },

  // ─── Marathi ───
  { id: 'ajay-atul', name: 'Ajay-Atul', image: getArtistAvatar('Ajay Atul'), genre: 'Marathi' },
  { id: 'avadhoot-gupte', name: 'Avadhoot Gupte', image: getArtistAvatar('Avadhoot Gupte'), genre: 'Marathi' },

  // ─── Bengali ───
  { id: 'rabindranath-tagore', name: 'Rabindranath Tagore', image: getArtistAvatar('Rabindranath Tagore'), genre: 'Bengali' },
  { id: 'rupam-islam', name: 'Rupam Islam', image: getArtistAvatar('Rupam Islam'), genre: 'Bengali' },

  // ─── Gujarati ───
  { id: 'falguni-pathak', name: 'Falguni Pathak', image: getArtistAvatar('Falguni Pathak'), genre: 'Gujarati' },
  { id: 'kinjal-dave', name: 'Kinjal Dave', image: getArtistAvatar('Kinjal Dave'), genre: 'Gujarati' },
  { id: 'geeta-rabari', name: 'Geeta Rabari', image: getArtistAvatar('Geeta Rabari'), genre: 'Gujarati' },

  // ─── Haryanvi ───
  { id: 'raj-mawar', name: 'Raj Mawar', image: getArtistAvatar('Raj Mawar'), genre: 'Haryanvi' },
  { id: 'masoom-sharma', name: 'Masoom Sharma', image: getArtistAvatar('Masoom Sharma'), genre: 'Haryanvi' },
];

// ─── Trending Searches ───
export const TRENDING_SEARCHES = [
  'Kesariya', 'Apna Bana Le', 'Chaleya', 'Maan Meri Jaan', 'Heeriye',
  'Husn', 'Tere Vaaste', 'Pehle Bhi Main', 'Tum Hi Ho', 'Brown Munde',
  'Raataan Lambiyan', 'Pasoori', 'Dil Nu', 'Excuses', 'Insane', 'Ambar',
  'Kahani Suno', 'O Bedardeya', 'Coca Cola', 'Dhoka', 'Bhojpuri Hit Songs',
  'Pawan Singh New Song', 'Khesari Lal Yadav Songs', 'Bollywood New Songs 2024',
  'Arijit Singh Best Songs', 'Punjabi Hits 2024', 'Naatu Naatu', 'Srivalli',
  'Hanuman Chalisa', 'Prateek Kuhad Cold Mess', 'Karan Aujla Softly',
  'Marathi Lavani', 'Gujarati Garba', 'Haryanvi Dance Mix',
];

// ─── Moods ───
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
  { id: 'south', name: '🎬 South', query: 'south indian hit songs' },
  { id: 'sufi', name: '🕌 Sufi', query: 'sufi songs indian' },
  { id: 'indie', name: '🎸 Indie', query: 'indian indie songs' },
  { id: 'lofi', name: '🎧 Lofi', query: 'lofi bollywood chill' },
];
