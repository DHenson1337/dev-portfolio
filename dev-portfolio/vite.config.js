import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/dev-portfolio/", // Ensure this matches your repository name
  plugins: [react()],
});
