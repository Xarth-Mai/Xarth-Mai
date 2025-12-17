import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte(
    {
      compilerOptions: {
        css: 'external',
      }
    }
  )],
  css: {
    transformer: 'lightningcss',
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    target: 'esnext',
    modulePreload: {
      polyfill: false
    },
    minify: 'oxc',
    cssMinify: 'lightningcss',
  }
})
