import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// base must match the GitHub Pages repo sub-path (https://<user>.github.io/quran_ai/).
export default defineConfig({
  base: '/Quran-AI/',
  worker: { format: 'es' }, // whisper worker dynamic-imports transformers (code-split)
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'apple-touch-icon.png'],
      manifest: {
        id: '/Quran-AI/',
        name: 'نور القرآن',
        short_name: 'نور القرآن',
        description: 'مصحف تفاعلي يعمل بدون إنترنت: قراءة، تلاوة، تفسير، مواقيت الصلاة والحفظ.',
        lang: 'ar',
        dir: 'rtl',
        categories: ['education', 'books', 'lifestyle'],
        start_url: '.',
        scope: '.',
        display: 'standalone',
        background_color: '#FDF2E7',
        theme_color: '#004333',
        screenshots: [
          { src: 'screenshot-1.png', sizes: '1080x1920', type: 'image/png', form_factor: 'narrow' },
          { src: 'screenshot-2.png', sizes: '1080x1920', type: 'image/png', form_factor: 'narrow' },
        ],
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
        shortcuts: [
          { name: 'متابعة القراءة', url: '/Quran-AI/#/mushaf' },
          { name: 'مواقيت الصلاة', url: '/Quran-AI/#/prayer' },
          { name: 'التسميع', url: '/Quran-AI/#/tasmi' },
          { name: 'المسبحة', url: '/Quran-AI/#/tasbih' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,woff2}'],
        // custom SW code: periodic-sync reminder + notification click handlers
        importScripts: ['sw-reminders.js'],
        // Offline-ASR chunks (Vosk / transformers.js Whisper) are large and loaded
        // only on demand — keep them out of precache (fetched when the user opts in).
        globIgnores: ['**/vosk-*.js', '**/transformers*.js', '**/ort-*.js', '**/*.wasm', 'og/**'],
        runtimeCaching: [
          {
            // Bundled JSON: serve from cache (offline) but revalidate in the
            // background so updated data (e.g. reciter list) refreshes after a rebuild.
            urlPattern: ({ url }) => url.pathname.includes('/data/'),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'quran-data',
              expiration: { maxEntries: 50 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Adhan sound: cache on first play so it works offline.
            urlPattern: ({ url }) => url.pathname.endsWith('adhan.mp3'),
            handler: 'CacheFirst',
            options: { cacheName: 'adhan', cacheableResponse: { statuses: [0, 200] } },
          },
          {
            // Reciter + per-word audio: cache so downloaded content plays offline.
            urlPattern: ({ url }) =>
              url.href.includes('cdn.islamic.network') || url.href.includes('qurancdn.com') || url.href.includes('verses.quran.com'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'reciter-audio',
              expiration: { maxEntries: 5000 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
});
