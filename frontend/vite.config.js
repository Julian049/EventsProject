import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    host: true,
    port: 5173,
    proxy: {
      '/event': {
        target: 'http://localhost:3250',
        changeOrigin: true,
        secure: false
      },
      '/category': {
        target: 'http://localhost:3250',
        changeOrigin: true,
        secure: false
      }
    }
  }
})