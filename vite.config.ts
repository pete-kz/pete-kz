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
      devOptions: { enabled: true }
    }),
    tsconfigPaths(),
    visualizer({ open: true }) as unknown as PluginOption
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@mui')) return 'mui'
            return 'vendor'
          }
        }
      }
    }
  }
})
