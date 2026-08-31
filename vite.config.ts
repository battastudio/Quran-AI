import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// base must match the GitHub Pages repo sub-path (https://<user>.github.io/quran_ai/).
export default defineConfig({
  base: '/quran_ai/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'الفرقان — القرآن الكريم',
        short_name: 'الفرقان',
        description: 'مصحف تفاعلي يعمل بدون إنترنت: قراءة، تلاوة، تفسير، مواقيت الصلاة والحفظ.',
        lang: 'ar',
        dir: 'rtl',
        start_url: '.',
        scope: '.',
        display: 'standalone',
        background_color: '#0f1511',
        theme_color: '#0f1511',
        // ponytail: SVG icon for now — add real PNG 192/512 launcher art (batta-icon
        // skill or a designer) before store-quality release; iOS prefers PNG.
        icons: [
          { src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          { src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,woff2,json}'],
        // Cache reciter audio at runtime so downloaded surahs play offline.
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.href.includes('everyayah.com'),
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
