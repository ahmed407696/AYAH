import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// DEPLOY_TARGET=pages → build for GitHub Pages project site (/AYAH/), otherwise root
const PAGES = process.env.DEPLOY_TARGET === 'pages'
const BASE = PAGES ? '/AYAH/' : '/'

export default defineConfig({
  base: BASE,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/apple-touch-icon.png', 'icons/favicon.png'],
      manifest: {
        name: 'AYAH — Premium Tech',
        short_name: 'AYAH',
        description:
          'AYAH — premium technology products. Browse the catalog, discover new gear and order via WhatsApp.',
        lang: 'en',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#05070D',
        theme_color: '#05070D',
        categories: ['shopping', 'electronics', 'lifestyle'],
        icons: [
          { src: 'icons/pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ],
        shortcuts: [
          { name: 'Browse products', url: './#/shop', icons: [{ src: 'icons/pwa-192.png', sizes: '192x192' }] },
          { name: 'Favorites', url: './#/favorites', icons: [{ src: 'icons/pwa-192.png', sizes: '192x192' }] }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,jpg,woff,woff2}'],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        navigateFallback: PAGES ? '/AYAH/index.html' : '/index.html',
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'ayah-runtime-images',
              expiration: { maxEntries: 120, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] }
            }
          }
        ]
      }
    })
  ],
  server: { host: true, allowedHosts: true },
  preview: { host: true, allowedHosts: true }
})
