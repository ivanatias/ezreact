import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import { resolve } from 'node:path'

const root = resolve(__dirname, 'src')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      lib: resolve(root, 'lib')
    }
  }
})
