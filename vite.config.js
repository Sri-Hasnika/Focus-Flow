import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Allow external access
    port: 10000, // Render assigns a port, but you can set a default
  },
  preview: {
    allowedHosts: ["focusflow-750n.onrender.com"], // Allow Render host
  },
})
