import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const rootDir = process.cwd();


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()]
})
