import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: false, // Don't activate SW in dev (avoid stale caching during development)
      },
      includeAssets: ['favicon.svg', 'robots.txt'],
      manifest: {
        name: 'O2Clinic — B2B Medical Store',
        short_name: 'O2Clinic',
        description: 'Wholesale medical supply ordering platform for healthcare professionals',
        theme_color: '#0284C7',
        background_color: '#F8FAFC',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'maskable'
          }
        ],
        categories: ['medical', 'shopping', 'business'],
        shortcuts: [
          {
            name: 'Browse Medicines',
            short_name: 'Catalog',
            description: 'Browse the medicine catalog',
            url: '/products',
            icons: [{ src: 'favicon.svg', sizes: 'any' }]
          },
          {
            name: 'My Orders',
            short_name: 'Orders',
            description: 'View your order history',
            url: '/orders',
            icons: [{ src: 'favicon.svg', sizes: 'any' }]
          }
        ]
      },
      workbox: {
        // Cache static assets aggressively
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        // Runtime caching for dynamic data
        runtimeCaching: [
          {
            // Cache Google Fonts
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 }, // 1 year
            },
          },
          {
            // Cache Supabase API responses (short-lived)
            urlPattern: /^https:\/\/.*\.supabase\.co\/rest\/v1\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 5 }, // 5 minutes
              networkTimeoutSeconds: 10,
            },
          },
          {
            // Cache product images (Unsplash + external)
            urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'product-images',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 }, // 30 days
            },
          },
        ],
      },
    })
  ],
  build: {
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['framer-motion', 'lucide-react'],
          supabase: ['@supabase/supabase-js'],
          state: ['zustand'],
        },
      },
    },
  },
})
