import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PORT || 5173, // Ensure it picks up Render's dynamic port
    host: "0.0.0.0", // Allow external access
  },
  preview: {
    port: process.env.PORT || 5173, // Ensure it picks up Render's dynamic port
    host: "0.0.0.0", // Make sure it's externally accessible
    allowedHosts: ['samaan.onrender.com', 'localhost'] // Add this line to fix the error
  },
  define: {
    global: "window",
  },
});