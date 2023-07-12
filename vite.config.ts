import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const rootDir = process.cwd();


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@Components': path.resolve(rootDir, 'src/Components'),
      '@Shared': path.resolve(rootDir, 'src/Shared'),
      "@Context": path.resolve(rootDir, 'src/Context'),
      "@Utils": path.resolve(rootDir, "src/utils")
    },
  },
})
