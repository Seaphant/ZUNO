import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Allow access from network
    port: 5173,
    strictPort: true, // Always use 5173
    hmr: {
      clientPort: 443, // For Cloudflare tunnel
    },
    allowedHosts: [
      '.trycloudflare.com', // Allow all Cloudflare tunnel hosts
      '.loca.lt', // Allow localtunnel hosts too
    ],
  },
  build: {
    target: 'esnext',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            if (id.includes('qrcode')) {
              return 'qrcode-vendor';
            }
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'qrcode.react'],
  },
})
