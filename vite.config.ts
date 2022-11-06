/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
  legacy({
    targets: ['defaults', 'not IE 11']
  })],
  test: {
    globals: true,
    environment: 'jsdom'
  },
  css: {
    devSourcemap: true
  },
  resolve: {
    alias: [{ find: '@', replacement: '/src' }]
  }
})
