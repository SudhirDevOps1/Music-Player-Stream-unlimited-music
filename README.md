# Music Player Web App

A modern, production-ready music player web application built with React, Vite, TypeScript, and Tailwind CSS.

## Features

- 🔍 **Smart Search**: Search for songs using Invidious, Piped, or YouTube Data API with automatic fallback
- 🎵 **Queue Management**: Add songs to queue, reorder, and play in sequence
- 💾 **Offline Playback**: Cache songs in IndexedDB for offline listening
- 🎨 **Waveform Visualizer**: Real-time audio visualization for cached songs
- 🎭 **Spinning Album Art**: Animated album art while playing
- 🎨 **Dark/Light Mode**: Toggle between themes with persistent settings
- ⌨️ **Keyboard Shortcuts**: Full keyboard control for playback
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🔔 **Toast Notifications**: Real-time feedback for all actions

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS 4
- **State Management**: React Hooks
- **Storage**: IndexedDB (via idb library), localStorage
- **Icons**: Lucide React
- **Audio**: YouTube IFrame API, Web Audio API

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd music-player
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## YouTube API Key (Optional)

While the app works without a YouTube API key (using Invidious/Piped), you can add your own key for better search results:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the YouTube Data API v3
4. Create credentials (API Key)
5. Add the key in the app settings (gear icon) or set as environment variable

### Setting API Key on Vercel

When deploying to Vercel, add the environment variable:

```
YOUTUBE_API_KEY=your_api_key_here
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Space / K | Play/Pause |
| Arrow Right | Seek forward 10s |
| Arrow Left | Seek backward 10s |
| Arrow Up | Volume up |
| Arrow Down | Volume down |
| M | Mute/Unmute |
| N | Next song |
| P | Previous song |
| Shift + N | Toggle shuffle |

## Project Structure

```
/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── vercel.json
├── README.md
├── public/
│   └── favicon.svg
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── types/
│   │   ├── index.ts
│   │   └── youtube.d.ts
│   ├── utils/
│   │   ├── api.ts
│   │   ├── cache.ts
│   │   ├── audioCache.ts
│   │   ├── youtubePlayer.ts
│   │   └── cn.ts
│   ├── hooks/
│   │   ├── usePlayer.ts
│   │   ├── useQueue.ts
│   │   ├── useOfflineCache.ts
│   │   └── useAudioVisualizer.ts
│   └── data/
│       └── artists.ts
```

## API Providers

The app uses multiple search providers with automatic fallback:

1. **Invidious**: No API key required, open-source YouTube frontend
2. **Piped**: No API key required, privacy-focused YouTube frontend
3. **YouTube Data API**: Requires API key, official YouTube API

## Offline Support

- Songs can be cached for offline playback
- Cache is stored in IndexedDB
- Clear cache from settings
- App works offline with cached content

## Deployment

### Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables (YOUTUBE_API_KEY)
4. Deploy

### Other Platforms

The app is built with Vite and can be deployed to any static hosting:

```bash
npm run build
# Deploy the 'dist' folder
```

## License

MIT License - feel free to use this project for learning or commercial purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- [Invidious](https://invidious.io/)
- [Piped](https://github.com/TeamPiped/Piped)
- [YouTube IFrame API](https://developers.google.com/youtube/iframe_api_reference)
- [Lucide Icons](https://lucide.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
