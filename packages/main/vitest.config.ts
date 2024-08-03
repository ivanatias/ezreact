import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'
import { resolve } from 'node:path'

const root = resolve(__dirname, 'src')

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './src/__tests__/setup.ts'
  },
  resolve: {
    alias: {
      '@': root,
      lib: resolve(root, 'lib')
    }
  }
})
