import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 150,
    rollupOptions: {
      output: {
        manualChunks: {
          mathjs: ['mathjs']
        }
      }
    }
  }
})
