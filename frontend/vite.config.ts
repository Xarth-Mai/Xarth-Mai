import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), svelte()],
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    target: 'esnext',
    modulePreload: { polyfill: false },
    minify: 'oxc',
    rollupOptions: {
      output: {
        advancedChunks: {
          groups: [{ name: 'svelte', test: /\/svelte/ }]
        }
      }
    }
  }
})
