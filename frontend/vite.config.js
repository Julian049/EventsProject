import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main:       resolve(__dirname, 'index.html'),
        categories: resolve(__dirname, 'categories.html'),
        detail:     resolve(__dirname, 'detail.html'),
        report:     resolve(__dirname, 'report.html'),
      }
    }
  }
})
