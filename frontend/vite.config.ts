import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' 

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // The '@' symbol will now resolve to the 'src' folder
      '@': path.resolve(__dirname, './src'),
    },
  },
})