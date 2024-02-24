import { defineConfig, type PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import tsconfigPaths from 'vite-tsconfig-paths'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      mode: (process.env.NODE_ENV as 'development' | 'production' | undefined) || 'development',
      injectRegister: 'auto',
      registerType: 'prompt',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}', '**/**/*.{js,css,html,ico,png,svg,json}', '*.{js,css,html,ico,png,svg,json}']
      },
      devOptions: { enabled: true },
      manifest: {
        'name': 'Pete',
        'short_name': 'Pete',
        'start_url': '/',
        'scope': '/',
        'display': 'standalone',
        'background_color': '#ffffff',
        'lang': 'ru',
        'theme_color': '#a485d6',
        'id': 'pete_pwa_app',
        'description': 'Find a loving home for your pets!',
        'dir': 'ltr',
        'orientation': 'portrait',
        'categories': [
          'business',
          'lifestyle',
          'utilities'
        ],
        'icons': [
          {
            'src': '/icons/android-chrome-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': '/icons/android-chrome-512x512.png',
            'sizes': '512x512',
            'type': 'image/png',
          },
          {
            'src': '/icons/android-chrome-maskable-192x192.png',
            'sizes': '192x192',
            'type': 'image/png',
            'purpose': 'maskable'
          },
          {
            'src': '/icons/android-chrome-maskable-512x512.png',
            'sizes': '512x512',
            'type': 'image/png',
            'purpose': 'maskable'
          }
        ],
        'shortcuts' : [
          {
            'name': 'Add new pet',
            'url': '/pwa/pets/add'
          },
          {
            'name': 'PETE',
            'url': '/pwa'
          },
          {
            'name': 'Settings',
            'url': '/pwa/settings'
          }
        ]
      }
    }),
    tsconfigPaths(),
    visualizer({ open: true }) as unknown as PluginOption
  ],
  // build: {
  //   rollupOptions: {
  //     output: {
  //       manualChunks(id) {
  //         if (id.includes('node_modules')) {
  //           if (id.includes('radix') || id.includes('ui')) return 'UI'
  //           return 'vendor'
  //         }
  //         return 'index'
  //       }
  //     }
  //   }
  // }
})
